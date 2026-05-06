import { expect, type Locator, type Page } from '@playwright/test';
import type { ProductSummary } from './ProductsPage';
import type { RegisterUser } from '../utils/testData';

export class CheckoutPage {
  readonly page: Page;
  readonly deliveryAddressBox: Locator;
  readonly commentBox: Locator;
  readonly placeOrderLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.deliveryAddressBox = page.locator('#address_delivery');
    this.commentBox = page.locator('textarea[name="message"]');
    this.placeOrderLink = page.getByRole('link', { name: /place order/i });
  }

  async verifyCheckoutPageIsOpen() {
    await expect(this.page).toHaveURL(/\/checkout/);
    await expect(this.deliveryAddressBox).toBeVisible({ timeout: 15000 });
  }

  async verifyShippingDetails(user: RegisterUser) {
    await expect(this.deliveryAddressBox).toContainText(`${user.firstName} ${user.lastName}`);
    await expect(this.deliveryAddressBox).toContainText(user.address1);
    await expect(this.deliveryAddressBox).toContainText(user.city);
    await expect(this.deliveryAddressBox).toContainText(user.state);
    await expect(this.deliveryAddressBox).toContainText(user.zipcode);
    await expect(this.deliveryAddressBox).toContainText(user.mobileNumber);
  }

  async verifyOrderReview(product: ProductSummary, quantity: number) {
    const firstRow = this.page
      .locator('table tbody tr')
      .filter({ hasText: product.name })
      .filter({ hasText: product.price })
      .first();

    await expect(firstRow).toContainText(product.name);
    await expect(firstRow).toContainText(product.price);
    await expect(firstRow.getByRole('button', { name: String(quantity), exact: true })).toBeVisible();
  }

  async placeOrder(orderComment: string) {
    await this.commentBox.fill(orderComment);
    await this.placeOrderLink.click();
  }
}