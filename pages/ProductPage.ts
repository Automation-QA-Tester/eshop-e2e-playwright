import { type Locator, type Page } from "@playwright/test";

export class ProductPage {
    readonly productName: Locator;
    readonly addCart: Locator;
    readonly alert: Locator;

    constructor(page: Page) {
        this.productName = page.locator('[data-test="product-name"]');
        this.addCart = page.getByRole('button', { name: 'Add to cart' });
        this.alert = page.getByRole('alert', { name: 'Product added to shopping cart.' });
    }

    async addToCart() {
        await this.addCart.click();
    }
}