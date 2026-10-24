import {test, expect} from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

test('Search and Cart', async ({page})=> {
    const homepage = new HomePage(page)
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);


    await homepage.goto();
    await homepage.searchFor('Pliers');
   
    //await page.locator('[data-test="product-01M5Q3D91YRMP339BE6NN0ZBDN"]').click();
    //await page.getByTestId('product-name').filter({hasText: 'Combination Pliers'}).click();
    await homepage.openProduct('Combination Pliers');

    await expect(productPage.productName).toHaveText('Combination Pliers');
    // await page.getByRole('button', {name: 'Add to cart '}).click();
    // await expect(page.getByRole('alert',{name: 'Product added to shopping cart.'})).toBeVisible();
    await productPage.addCartButton();

    // await page.locator('[data-test="nav-cart"]').click();
    await cartPage.cartButton();

    // await expect(page.locator('[data-test="product-title"]')).toHaveText('Combination Pliers');
    await expect(cartPage.cartProduct).toHaveText('Combination Pliers');
})