import { test, expect } from '@playwright/test';
import { categoryApiRoutes } from '../mockRoutes/categoryApiRoutes.ts';

test.describe('Category Page Tests', () => {
  let urlApiCallsHistory: Set<string>;

  // Initialize the set before all tests
  test.beforeAll(() => {
    urlApiCallsHistory = new Set();
  });

  // Use beforeEach to clear the set before each test
  test.beforeEach(async ({ page }) => {
    urlApiCallsHistory.clear(); // Clear the set to maintain the reference

    // Callback to capture and store API request URLs
    const onApiRequest = (url: string) => {
      const apiUrlPart = url.substring(url.indexOf('/api'));
      urlApiCallsHistory.add(apiUrlPart);
    };

    // Register API route listener
    await categoryApiRoutes(page, onApiRequest);

    // Navigate to the category page and wait for it to load completely
    await page.goto('/categories/?slug=mobiles');
    await page.waitForLoadState('load');
  });

  test('should return a 200 status and load products correctly', async ({ page }) => {
    await page.waitForTimeout(2000);
    // Check if the initial API call for products is made
    const mobileCategoryApiUrl = '/api/products/?category=mobiles';
    expect(urlApiCallsHistory.has(mobileCategoryApiUrl)).toBe(true);

    // Take a full-page screenshot for visual validation
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('categorypage.png');
  });

  test('should filter products by discount and order by ascending price', async ({ page }) => {
    await page.waitForTimeout(1000);
    // Apply filters and sorting
    await page.getByLabel('Order by').click();
    await page.getByRole('option', { name: 'Price: Low to High' }).click();
    await page.getByLabel('Discount by').click();
    await page.getByRole('option', { name: '% to 20%' }).click();
    await page.waitForTimeout(1000); // Wait for discount filter to apply

    // Check if the filtered API call is made
    const discountCurrentPriceApiUrl = '/api/products/?category=mobiles&discount_min=10&discount_max=20&ordering=current_price';
    expect(urlApiCallsHistory.has(discountCurrentPriceApiUrl)).toBe(true);

    // Take another full-page screenshot for visual validation after applying filters
    await page.evaluate(() => window.scrollTo(0, 0));
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('discountCurrentPriceFilter.png');
  });

  test('should filter products by min and max price and order by descending price', async ({ page }) => {
    // Set min and max price values
    await page.waitForTimeout(1000);
    await page.getByLabel('Min', { exact: true }).fill('600');
    await page.getByLabel('Max', { exact: true }).fill('1000');
    // Apply descending price order
    await page.getByLabel('Order by').click();
    await page.getByRole('option', { name: 'Price: High to Low' }).click();
    await page.waitForTimeout(1000); // Wait for sorting to apply
    // Check if the filtered API call is made
    const priceRangeDescendingApiUrl = '/api/products/?category=mobiles&current_price_min=600&current_price_max=1000&ordering=-current_price';
    if (!urlApiCallsHistory.has(priceRangeDescendingApiUrl)) {
      console.error(`Expected URL ${priceRangeDescendingApiUrl} to be found in API call history, but it was not. API calls made: ${Array.from(urlApiCallsHistory).join(', ')}`);
    }
    expect(urlApiCallsHistory.has(priceRangeDescendingApiUrl)).toBe(true);
  
    // Take a full-page screenshot for visual validation after applying filters
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('priceRangeDescendingFilter.png');
  });
  
});


