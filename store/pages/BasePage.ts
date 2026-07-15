import type { Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async isBodyVisible(): Promise<boolean> {
    return this.page.locator('body').isVisible();
  }

  async waitForPageLoad(
    state: 'domcontentloaded' | 'load' | 'networkidle' = 'domcontentloaded',
  ): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  async acceptCookies(): Promise<void> {
    const button = this.page.locator('button:has-text("Aceptar")');
    if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
      await button.click();
    }
  }

  protected async getPriceByLabel(label: string): Promise<string> {
    const lines = (await this.page.locator('body').innerText()).split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith(label) || lines[i].trim() === label) {
        for (let j = i; j < Math.min(i + 5, lines.length); j++) {
          const match = lines[j].match(/\$\s*[\d.,]+/);
          if (match) return match[0].trim();
        }
      }
    }
    return '';
  }
}
