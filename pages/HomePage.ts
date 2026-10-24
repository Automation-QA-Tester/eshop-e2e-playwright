import { type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly product: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId('search-query');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.product = page.getByTestId('product-name');
  }

  async goto() {
    await this.page.goto('/');
  }

  async searchFor(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }
  async openProduct(name: string){
    await this.product.filter({hasText: name}).click();
  }
}