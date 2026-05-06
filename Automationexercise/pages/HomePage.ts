import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly signupLoginLink: Locator;
  readonly productsLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly loggedInUserText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signupLoginLink = page.getByRole('link', { name: /signup \/ login/i });
    this.productsLink = page.getByRole('link', { name: /products/i });
    this.deleteAccountLink = page.getByRole('link', { name: /delete account/i });
    this.loggedInUserText = page.locator('a').filter({ hasText: 'Logged in as' });
  }

  async goto() {
    await this.page.goto('https://automationexercise.com/', { waitUntil: 'domcontentloaded' });
  }

  async verifyHomePageIsOpen() {
    await expect(this.page).toHaveURL(/automationexercise\.com\/?$/);
    await expect(this.productsLink).toBeVisible({ timeout: 15000 });
  }

  async openSignupLogin() {
    await this.signupLoginLink.click();
  }

  async openProducts() {
    await this.productsLink.click();
  }

  async verifyLoggedInAs(username: string) {
    await expect(this.loggedInUserText).toContainText(username);
  }

  async deleteAccount() {
    await this.deleteAccountLink.click();
  }
}