import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { ProductPage } from '../pages/ProductPage';
import products from '../test-data/products.json';
import { parsePriceToCents } from '../utils/price';

test('Cart Price', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const productPage = new ProductPage(page);
    const quantity = 3;

    await homePage.goto();
    await homePage.searchFor(products.existingProduct.searchTerm);

    await homePage.openProduct(products.existingProduct.productName);

    await expect(productPage.productName).toHaveText(products.existingProduct.productName);
    await productPage.addToCart();

    await expect(productPage.alert).toBeVisible();

    await cartPage.openCart();

    await expect(cartPage.cartProduct).toHaveText(products.existingProduct.productName);

    const unitPrice = parsePriceToCents(await cartPage.unitPrice.innerText());

    await cartPage.setQuantity(quantity);
    await expect
    .poll(async () => parsePriceToCents(await cartPage.linePrice.innerText()))
    .toBe(unitPrice * quantity);
    await expect
    .poll(async () => parsePriceToCents(await cartPage.cartTotal.innerText()))
    .toBe(unitPrice * quantity);

})