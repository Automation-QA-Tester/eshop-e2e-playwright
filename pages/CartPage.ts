import { type Locator, type Page } from "@playwright/test";

export class CartPage{
    readonly cartProduct: Locator;
    readonly navCart: Locator;

    constructor(page: Page){
        this.cartProduct = page.locator('[data-test="product-title"]');
        this.navCart = page.locator('[data-test="nav-cart"]');
    }

    async openCart(){
        await this.navCart.click();
    }
}