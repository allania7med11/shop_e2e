import categoriesResponse from '../mocks/categoriesResponse.json';

export const categoriesApiRoutes = async (page, onCategoriesRequest) => {
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
        } else if (url.includes('/api/categories/')) {
            onCategoriesRequest()
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(categoriesResponse),
            });
        } else {
            route.continue();
        }
    });
};