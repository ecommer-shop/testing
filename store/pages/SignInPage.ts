import { BasePage } from './BasePage.js';
import { ClerkComponent } from './components/ClerkComponent.js';
import type { Page, Locator } from '@playwright/test';

export class SignInPage extends BasePage {
  readonly clerk: ClerkComponent;
  private readonly identifierField: Locator;
  private readonly passwordField: Locator;

  constructor(page: Page) {
    super(page);
    this.clerk = new ClerkComponent(page);
    this.identifierField = this.page.locator('#identifier-field');
    this.passwordField = this.page.locator('#password-field');
  }

  async navigate(): Promise<void> {
    await this.goto('/sign-in');
    await this.identifierField.waitFor({ state: 'visible', timeout: 10000 });
  }

  async login(email: string, password: string): Promise<void> {
    await this.identifierField.fill(email);
    await this.passwordField.fill(password);
    await this.clerk.clickContinue();
  }

  async isLoaded(): Promise<boolean> {
    return this.identifierField.isVisible();
  }
}
