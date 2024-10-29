import { test, expect } from '@playwright/test';
import { categoryApiRoutes } from '../mockRoutes/categoryApiRoutes.ts';

test('The categorypage should return a 200 status and verify that the products render correctly.', async ({ page }) => {
  const urlApiCallsHistory = new Set();
  // Define a callback to set the categoriesRequested flag
  const onApiRequest = (url) => {
    const apiUrlPart = url.substring(url.indexOf('/api'));
    urlApiCallsHistory.add(apiUrlPart)
  };
  await categoryApiRoutes(page, onApiRequest);
  const response = await page.goto('/categories/?slug=mobiles');
  await page.waitForLoadState('load');
  await page.waitForTimeout(2000);
  expect(response?.status()).toBe(200);
  const mobileCategoryApiUrl = '/api/products/?category=mobilesa'
  expect(urlApiCallsHistory.has(mobileCategoryApiUrl)).toBe(true);
  // Compare the current screenshot with the baseline image
  expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('categorypage.png');
});

