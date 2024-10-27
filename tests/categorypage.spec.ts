import { test, expect } from '@playwright/test';
import { categoryApiRoutes } from '../mockRoutes/categoryApiRoutes.ts';

test('The categorypage should return a 200 status and verify that the products render correctly.', async ({ page }) => {
  let mobileCategoryRequest = false;
  // Define a callback to set the categoriesRequested flag
  const onMobileCategoryRequest = () => {
    mobileCategoryRequest = true;
  };
  await categoryApiRoutes(page, onMobileCategoryRequest);
  const response = await page.goto('/categories/?slug=mobiles');
  await page.waitForLoadState('load');
  await page.waitForTimeout(2000);

  expect(response?.status()).toBe(200);
  expect(mobileCategoryRequest).toBe(true);

  // Compare the current screenshot with the baseline image
  expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('categorypage.png');
});

