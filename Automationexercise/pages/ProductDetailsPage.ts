import { expect, type Locator, type Page } from '@playwright/test';
import type { ProductSummary } from './ProductsPage';

export class ProductDetailsPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('.product-information h2');
    this.productPrice = page.locator('.product-information span span');
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.viewCartLink = page.getByRole('link', { name: /view cart/i });
  }

  async verifyProductDetails(product: ProductSummary) {
    await expect(this.productName).toHaveText(product.name, { timeout: 15000 });
    await expect(this.productPrice).toHaveText(product.price);
  }

  async addProductToCart(quantity: number) {
    await this.quantityInput.fill(String(quantity));
    await this.addToCartButton.click();
    await expect(this.viewCartLink).toBeVisible();
  }

  async openCartFromModal() {
    await this.viewCartLink.click();
  }
}