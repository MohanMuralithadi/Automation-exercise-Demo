import { expect, type Locator, type Page } from '@playwright/test';
import type { RegisterUser } from '../utils/testData';

export class AccountPage {
  readonly page: Page;
  readonly accountInfoHeading: Locator;
  readonly accountCreatedHeading: Locator;
  readonly accountDeletedHeading: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountInfoHeading = page.getByText(/enter account information/i);
    this.accountCreatedHeading = page.getByText(/account created!/i);
    this.accountDeletedHeading = page.getByText(/account deleted!/i);
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }

  async createAccount(user: RegisterUser) {
    await expect(this.accountInfoHeading).toBeVisible({ timeout: 15000 });

    // Complete account credentials and personal information.
    await this.page.locator('#id_gender1').check();
    await this.page.locator('#password').fill(user.password);
    await this.page.locator('#days').selectOption(user.birthDay);
    await this.page.locator('#months').selectOption(user.birthMonth);
    await this.page.locator('#years').selectOption(user.birthYear);
    await this.page.locator('#newsletter').check();
    await this.page.locator('#optin').check();

    // Fill address information used later for checkout shipping validation.
    await this.page.locator('#first_name').fill(user.firstName);
    await this.page.locator('#last_name').fill(user.lastName);
    await this.page.locator('#company').fill(user.company);
    await this.page.locator('#address1').fill(user.address1);
    await this.page.locator('#address2').fill(user.address2);
    await this.page.locator('#country').selectOption(user.country);
    await this.page.locator('#state').fill(user.state);
    await this.page.locator('#city').fill(user.city);
    await this.page.locator('#zipcode').fill(user.zipcode);
    await this.page.locator('#mobile_number').fill(user.mobileNumber);
    await this.page.getByRole('button', { name: /create account/i }).click();
  }

  async verifyAccountCreatedAndContinue() {
    await expect(this.accountCreatedHeading).toBeVisible({ timeout: 15000 });
    await this.continueButton.click();
  }

  async verifyAccountDeletedAndContinue() {
    await expect(this.accountDeletedHeading).toBeVisible({ timeout: 15000 });
    await this.continueButton.click();
  }
}