import categoryMobileResponse from '../mocks/categoryMobileResponse.json';
import productsMobilesResponse from '../mocks/productsMobilesResponse.json';
import discountCurrentPriceResponse from '../mocks/productFilters/discountCurrentPriceResponse.json';
import priceDescendingResponse from '../mocks/productFilters/priceDescendingResponse.json';

export const categoryApiRoutes = async (page, onApiRequest) => {
    await page.route('**/api/**', (route, request) => {
        const url = request.url();
        onApiRequest(url)
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
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(categoryMobileResponse),
            });
        } else if (url.endsWith('/api/products/?category=mobiles')) {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(productsMobilesResponse),
            });
        } else if (url.endsWith('/api/products/?category=mobiles&discount_min=10&discount_max=20&ordering=current_price')) {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(discountCurrentPriceResponse),
            });
        } else if (url.endsWith('/api/products/?category=mobiles&current_price_min=600&current_price_max=1000&ordering=-current_price')) {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(priceDescendingResponse),
            });
        }else if (url.includes('/api/products/?category=mobiles')) {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([]),
            });
        } else {
            route.continue();
        }
    });
};
