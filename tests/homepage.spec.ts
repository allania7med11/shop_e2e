import { test, expect } from '@playwright/test';

test('homepage should return 200 status and check if /api/categories/ was requested', async ({ page }) => {
  // Define a flag to check if the endpoint was requested
  let categoriesRequested = false;

  // Intercept network requests
  await page.route('**/api/**', (route, request) => {
    const url = request.url();
    const method = request.method();
    console.log(`Request intercepted: ${url}`); // Log all intercepted requests

    if (url.includes('/api/auth/profile/')) {
      // Mock a 403 response for the auth profile endpoint
      route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Forbidden' }),
      });
    } else if (url.includes('/api/cart/current/')) {
      // Mock a JSON response for the cart endpoint
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 37,
          total_amount: '0.00',
          items: [],
          address: null,
        }),
      });
    } else if (url.includes('/api/categories/')) {
      // Log when the categories endpoint is requested
      console.log('Request to /api/categories/ detected');
      // Set the flag to true if the /api/categories/ endpoint is requested
      categoriesRequested = true;
      // Mock a response for categories
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            url: 'http://localhost/api/categories/mobiles/',
            slug: 'mobiles',
            id: 1,
            name: 'mobiles',
            products: [
              {
                url: 'http://localhost/api/products/samsung-galaxy-s22-cell-phone/',
                slug: 'samsung-galaxy-s22-cell-phone',
                id: 9,
                name: 'SAMSUNG Galaxy S22+ Cell Phone',
                files: [
                  {
                    url: 'https://res.cloudinary.com/dkljxonku/image/upload/visxlcqd5oupmogu54gx',
                  },
                ],
                price: '910.00',
                price_currency: 'USD',
                discount: null,
                current_price: 910.0,
                category: {
                  url: 'http://localhost/api/categories/mobiles/',
                  slug: 'mobiles',
                  id: 1,
                  name: 'mobiles',
                },
                description_html: 'Some HTML description',
                updated_at: '2024-04-07T18:26:05.998937Z',
              },
            ],
          },
        ]),
      });
    } else if (url.includes('/api/auth/csrf/')) {
      // Mock a 200 response for the CSRF endpoint
      console.log('Request to /api/auth/csrf/ detected');
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ csrfToken: 'dummy-csrf-token' }),
      });
    } else {
      // Let other requests go through without interception
      route.continue();
    }
  });

  // Go to the homepage
  const response = await page.goto('http://shop_front:3000'); 

  // Wait for the page to load completely
  await page.waitForLoadState('load');

  // Wait for 10 seconds
  await page.waitForTimeout(1000);

  // Check if the status code is 200
  expect(response?.status()).toBe(200);

  // Assert that /api/categories/ was requested
  expect(categoriesRequested).toBe(true);

  // Optionally: Take a screenshot or perform other actions
  await page.screenshot({ path: 'screenshots/homepage.png' });
});
