import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import products from '../test-data/products.json';

test('Search with no results', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.searchFor(products.missingProduct.searchTerm);

    await expect(homePage.noResultMessage).toContainText(products.missingProduct.expectedMessage);
    await expect(homePage.product).toHaveCount(0);
})

