import {test, expect} from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

test('Search and Cart', async ({page})=> {
    const homePage = new HomePage(page)
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);


    await homePage.goto();
    await homePage.searchFor('Pliers');
   
    await homePage.openProduct('Combination Pliers');

    await expect(productPage.productName).toHaveText('Combination Pliers');
    await productPage.addToCart();

    await expect(productPage.alert).toBeVisible();

    await cartPage.openCart();

    await expect(cartPage.cartProduct).toHaveText('Combination Pliers');
})