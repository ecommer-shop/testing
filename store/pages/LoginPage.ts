import { BasePage } from './BasePage.js';
import type { Page } from '@playwright/test';

/**
 * @deprecated Use {@link SignInPage} for login and {@link SignUpPanel} for registration.
 * This class assumes /login route and selectors that do not match the real DOM.
 * Will be removed once all tests migrate to the new Clerk-based Page Objects.
 */
export class LoginPage extends BasePage {
  private readonly emailField;
  private readonly passwordField;
  private readonly submitButton;
  private readonly loginForm;
  private readonly errorMessage;

  constructor(page: Page) {
    super(page);
    this.loginForm = this.page.locator('form');
    this.emailField = this.page.locator('input[type="email"], input[name="email"]');
    this.passwordField = this.page.locator('input[type="password"], input[name="password"]');
    this.submitButton = this.page.locator(
      'button[type="submit"], button:has-text("Login"), button:has-text("Sign in")',
    );
    this.errorMessage = this.page.locator('[role="alert"], .error, .validation-message');
  }

  async navigate(): Promise<void> {
    await this.goto('login');
  }

  async isLoaded(): Promise<boolean> {
    return this.loginForm.isVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.submitButton.click();
  }

  async hasErrorMessage(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }
}
