import { type Locator, type Page } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly product: Locator;
    readonly noResultMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.getByTestId('search-query');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.product = page.getByTestId('product-name');
        this.noResultMessage = page.getByTestId('no-results');
    }

    async goto() {
        await this.page.goto('/');
    }

    async searchFor(term: string) {
        await this.searchInput.fill(term);
        const responsePromise = this.page.waitForResponse(
            (response) => response.url().includes('/products/search') && response.ok()
        );
        await this.searchButton.click();
        await responsePromise;
    }

    async openProduct(name: string) {
        await this.product.filter({ hasText: new RegExp(`^\\s*${name}\\s*$`) }).click();
    }
}