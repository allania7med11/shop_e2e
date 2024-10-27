import { test, expect } from '@playwright/test';
import categoriesResponse from '../mocks/categoriesResponse.json';

test('The homepage should return a 200 status and verify that the categories render correctly.', async ({ page }) => {
  let categoriesRequested = false;

  await page.route('**/api/**', (route, request) => {
    const url = request.url();
    const method = request.method();

    if (url.includes('/api/auth/profile/')) {
      route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Forbidden' }),
      });
    } else if (url.includes('/api/cart/current/')) {
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
      console.log('Request to /api/categories/ detected');
      categoriesRequested = true;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(categoriesResponse),
      });
    } else if (url.includes('/api/auth/csrf/')) {
      console.log('Request to /api/auth/csrf/ detected');
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ csrfToken: 'dummy-csrf-token' }),
      });
    } else {
      route.continue();
    }
  });

  const response = await page.goto('');
  await page.waitForLoadState('load');
  await page.waitForTimeout(2000);

  expect(response?.status()).toBe(200);
  expect(categoriesRequested).toBe(true);

  // Compare the current screenshot with the baseline image
  expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('homepage.png');
});
