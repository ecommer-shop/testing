import { BasePage } from './BasePage.js';
import type { Page, Locator } from '@playwright/test';

export class HomePage extends BasePage {
  private readonly mainSection: Locator;
  private readonly heroSection: Locator;

  constructor(page: Page) {
    super(page);
    this.mainSection = this.page.locator('main');
    this.heroSection = this.page.locator('header');
  }

  async navigate(): Promise<void> {
    await this.goto('/');
    await this.acceptCookies();
  }

  async isLoaded(): Promise<boolean> {
    const heroVisible = await this.heroSection.isVisible().catch(() => false);
    const mainVisible = await this.mainSection.isVisible().catch(() => false);
    return heroVisible && mainVisible;
  }
}
