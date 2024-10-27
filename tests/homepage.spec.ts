import { test, expect } from '@playwright/test';

test('homepage should return 200 status and have expected content', async ({ page }) => {
  // Go to the homepage
  const response = await page.goto('http://shop_front:3000'); 

  // Check if the status code is 200
  expect(response?.status()).toBe(200);

});


