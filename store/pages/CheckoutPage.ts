import { BasePage } from './BasePage.js';
import type { Page } from '@playwright/test';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.goto('/checkout');
    await this.page.locator('text=Pagar').first().waitFor({ state: 'visible', timeout: 10000 });
  }

  async isLoaded(): Promise<boolean> {
    return this.page.locator('text=Pagar').first().isVisible();
  }

  async hasShippingSection(): Promise<boolean> {
    return this.page.locator('text=Dirección de envío').first().isVisible();
  }

  async hasOrderSummary(): Promise<boolean> {
    return this.page.locator('text=Resumen del pedido').isVisible();
  }

  async getSubtotal(): Promise<string> {
    return this.getPriceByLabel('Subtotal');
  }

  async getTotal(): Promise<string> {
    return this.getPriceByLabel('Total');
  }
}
