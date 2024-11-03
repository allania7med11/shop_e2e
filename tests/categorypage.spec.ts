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
  const mobileCategoryApiUrl = '/api/products/?category=mobiles'
  expect(urlApiCallsHistory.has(mobileCategoryApiUrl)).toBe(true);
  expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('categorypage.png');
  await page.getByLabel('Order by').click()
  await page.getByRole('option', { name: 'Price: Low to High' }).click();
  await page.waitForTimeout(1000);
  await page.getByLabel('Discount by').click();
  await page.getByRole('option', { name: '% to 20%' }).click();
  await page.waitForTimeout(1000);
  const discountCurrentPriceApiUrl = '/api/products/?category=mobiles&discount_min=10&discount_max=20&ordering=current_price'
  expect(urlApiCallsHistory.has(discountCurrentPriceApiUrl)).toBe(true);
  expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('discountCurrentPriceFilter.png');
  await page.waitForTimeout(1000);
});

