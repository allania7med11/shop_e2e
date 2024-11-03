import { test, expect } from '@playwright/test';
import { categoriesApiRoutes } from '../mockRoutes/categoriesApiRoutes.ts';

test('The homepage should return a 200 status and verify that the categories render correctly.', async ({ page }) => {
  let categoriesRequested = false;
  // Define a callback to set the categoriesRequested flag
  const onCategoriesRequest = () => {
    categoriesRequested = true;
  };
  await categoriesApiRoutes(page, onCategoriesRequest);
  const response = await page.goto('');
  await page.waitForLoadState('load');
  await page.waitForTimeout(2000);

  expect(response?.status()).toBe(200);
  expect(categoriesRequested).toBe(true);
  expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('homepage.png');
});
