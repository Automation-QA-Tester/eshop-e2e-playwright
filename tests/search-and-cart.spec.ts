import {test, expect} from '@playwright/test'

test('Search and Cart', async ({page})=> {
    await page.goto('https://practicesoftwaretesting.com/');
    
    await page.locator('[data-test="search-query"]').fill('Pliers');
    await page.getByRole('button',{name:'Search'}).click();
   
    await page.locator('[data-test="product-01M5Q3D91YRMP339BE6NN0ZBDN"]').click();

    await expect(page.locator('[data-test="product-name"]')).toHaveText('Combination Pliers');
    await page.getByRole('button', {name: 'Add to cart '}).click();
    await expect(page.getByRole('alert',{name: 'Product added to shopping cart.'})).toBeVisible();

    await page.locator('[data-test="nav-cart"]').click();

    await expect(page.locator('[data-test="product-title"]')).toHaveText('Combination Pliers');

})