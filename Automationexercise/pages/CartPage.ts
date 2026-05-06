import { expect, type Locator, type Page } from '@playwright/test';
import type { ProductSummary } from './ProductsPage';

export class CartPage {
  readonly page: Page;
  readonly cartRows: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartRows = page.locator('#cart_info_table tbody tr');
    this.proceedToCheckoutButton = page.getByText(/proceed to checkout/i);
  }

  async verifyCartPageIsOpen() {
    await expect(this.page).toHaveURL(/\/view_cart/);
    await expect(this.cartRows.first()).toBeVisible({ timeout: 15000 });
  }

  async verifyProductInCart(product: ProductSummary, quantity: number) {
    const firstRow = this.cartRows.first();

    await expect(firstRow.locator('.cart_description h4')).toContainText(product.name);
    await expect(firstRow.locator('.cart_price')).toContainText(product.price);
    await expect(firstRow.locator('.cart_quantity')).toContainText(String(quantity));
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }
}