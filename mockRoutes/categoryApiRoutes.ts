import categoryMobileResponse from '../mocks/categoryMobileResponse.json';
import productsMobilesResponse from '../mocks/productsMobilesResponse.json';

export const categoryApiRoutes = async (page, onMobileCategoryRequest) => {
    await page.route('**/api/**', (route, request) => {
        const url = request.url();
        if (url.includes('/api/auth/csrf/')) {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ csrfToken: 'dummy-csrf-token' }),
            });
        } else if (url.includes('/api/auth/profile/')) {
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
        } else if (url.includes('/api/categories/mobiles/')) {
            onMobileCategoryRequest()
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(categoryMobileResponse),
            });
        } else if (url.match(/\/api\/products\/\?category=mobiles(&|$)/)) {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(productsMobilesResponse),
            });
        } else {
            route.continue();
        }
    });
};