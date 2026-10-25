import {test, expect} from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import products from '../test-data/products.json';

test('Search and Cart', async ({page})=> {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);


    await homePage.goto();
    await homePage.searchFor(products.existingProduct.searchTerm);

    await homePage.openProduct(products.existingProduct.productName);


    await expect(productPage.productName).toHaveText(products.existingProduct.productName);
    await productPage.addToCart();

    await expect(productPage.alert).toBeVisible();

    await cartPage.openCart();

    await expect(cartPage.cartProduct).toHaveText(products.existingProduct.productName);
})