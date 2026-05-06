import { expect, type Locator, type Page } from '@playwright/test';

export class SignupLoginPage {
  readonly page: Page;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signupNameInput = page.getByPlaceholder('Name');
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.getByRole('button', { name: /signup/i });
    this.loginEmailInput = page.locator('[data-qa="login-email"]');
    this.loginPasswordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: /^login$/i });
  }

  async verifySignupLoginPageIsOpen() {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.signupButton).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async submitNewUserSignup(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  async login(email: string, password: string) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }
}