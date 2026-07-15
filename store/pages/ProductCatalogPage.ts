import { BasePage } from './BasePage.js';
import type { Page, Locator } from '@playwright/test';

export class ProductCatalogPage extends BasePage {
  private readonly category: string;

  constructor(page: Page, category = 'electronica') {
    super(page);
    this.category = category;
  }

  async navigate(): Promise<void> {
    await this.goto(`/collection/${this.category}`);
    await this.waitForPageLoad();
  }

  get productCards(): Locator {
    return this.page.locator('a[href*="/product/"]');
  }

  get buyButtons(): Locator {
    return this.page.getByRole('button', { name: 'Comprar' });
  }

  async hasProducts(): Promise<boolean> {
    await this.productCards.first().waitFor({ state: 'visible', timeout: 10000 });
    return (await this.productCards.count()) > 0;
  }
}
