import { type Locator, type Page } from "@playwright/test";

export class CartPage {
    readonly cartProduct: Locator;
    readonly navCart: Locator;
    readonly unitPrice: Locator;
    readonly quantityInput: Locator;
    readonly linePrice: Locator;
    readonly cartTotal: Locator;
    readonly page: Page;

    constructor(page: Page) {
        this.cartProduct = page.locator('[data-test="product-title"]');
        this.navCart = page.locator('[data-test="nav-cart"]');
        this.unitPrice = page.getByTestId('product-price');
        this.quantityInput = page.getByTestId('product-quantity');
        this.linePrice = page.getByTestId('line-price');
        this.cartTotal = page.getByTestId('cart-total');
        this.page = page;
    }

    async openCart() {
        await this.navCart.click();
    }

    async setQuantity(quantity: number) {
    await this.quantityInput.fill(String(quantity));
    const responsePromise = this.page.waitForResponse(
        (response) =>
            response.url().includes('/product/quantity') &&
            response.request().method() === 'PUT' &&
            response.ok()
    );
    await this.quantityInput.press('Tab');
    await responsePromise;
}
}