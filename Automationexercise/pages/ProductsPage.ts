import { expect, type Locator, type Page } from '@playwright/test';

export type ProductSummary = {
  name: string;
  price: string;
};

export class ProductsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsHeading = page.getByText(/searched products/i);
  }

  async verifyProductsPageIsOpen() {
    await expect(this.page).toHaveURL(/\/products/);
    await expect(this.searchInput).toBeVisible({ timeout: 15000 });
  }

  async searchProduct(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
    await expect(this.searchedProductsHeading).toBeVisible();
    await expect(this.page.locator('.features_items .product-image-wrapper').first()).toBeVisible();
  }

  async openFirstProductFromResults(): Promise<ProductSummary> {
    const firstProduct = this.page.locator('.features_items .product-image-wrapper').first();
    const name = (await firstProduct.locator('.productinfo p').innerText()).trim();
    const price = (await firstProduct.locator('.productinfo h2').innerText()).trim();

    await firstProduct.getByRole('link', { name: /view product/i }).click();

    return { name, price };
  }
}