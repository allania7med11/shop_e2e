import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://shop_front:3000',
  },
});
