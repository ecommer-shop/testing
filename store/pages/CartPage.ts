import { BasePage } from './BasePage.js';
import type { Page } from '@playwright/test';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.goto('/cart');
    await this.waitForPageLoad();
  }

  async isLoaded(): Promise<boolean> {
    return this.page.getByRole('heading', { name: 'Carrito de compras' }).isVisible();
  }

  async hasProducts(): Promise<boolean> {
    return this.page
      .locator('text=Tu carrito está vacío')
      .isHidden({ timeout: 3000 })
      .catch(() => false);
  }

  async getSubtotal(): Promise<string> {
    return this.getPriceByLabel('Subtotal');
  }

  async getTotal(): Promise<string> {
    return this.getPriceByLabel('Total');
  }
}
