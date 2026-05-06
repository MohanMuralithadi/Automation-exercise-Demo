import { expect, type Locator, type Page } from '@playwright/test';
import type { PaymentDetails } from '../utils/testData';

export class PaymentPage {
  readonly page: Page;
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payAndConfirmButton: Locator;
  readonly orderPlacedHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameOnCardInput = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"]');
    this.cvcInput = page.locator('[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('[data-qa="expiry-year"]');
    this.payAndConfirmButton = page.locator('[data-qa="pay-button"]');
    this.orderPlacedHeading = page.getByText(/order placed!/i);
  }

  async verifyPaymentPageIsOpen() {
    await expect(this.page).toHaveURL(/\/payment/);
    await expect(this.payAndConfirmButton).toBeVisible({ timeout: 15000 });
  }

  async submitPayment(payment: PaymentDetails) {
    await this.nameOnCardInput.fill(payment.nameOnCard);
    await this.cardNumberInput.fill(payment.cardNumber);
    await this.cvcInput.fill(payment.cvc);
    await this.expiryMonthInput.fill(payment.expiryMonth);
    await this.expiryYearInput.fill(payment.expiryYear);
    await this.payAndConfirmButton.click();
  }

  async verifyOrderConfirmationAndCaptureOrderId(): Promise<string> {
    await expect(this.orderPlacedHeading).toBeVisible({ timeout: 15000 });
    await expect(this.page.getByText(/congratulations! your order has been confirmed!/i)).toBeVisible();

    const pageText = await this.page.locator('body').innerText();
    const orderIdMatch = pageText.match(/(?:order|transaction)\s*(?:id|number)\s*[:#-]?\s*([A-Z0-9-]+)/i);

    return orderIdMatch?.[1] ?? 'Order ID not displayed by application';
  }
}