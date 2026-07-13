import type { Page } from '@playwright/test';

export class ClerkComponent {
  constructor(private readonly page: Page) {}

  async clickContinue(): Promise<void> {
    const button = this.page.locator('button:has-text("Continue"), button:has-text("Continuar")');
    await button.first().waitFor({ state: 'visible', timeout: 5000 });
    await button.first().click();
  }

  async clickGoogleLogin(): Promise<void> {
    await this.page.getByRole('button', { name: 'Google' }).click();
  }

  async clickFacebookLogin(): Promise<void> {
    await this.page.getByRole('button', { name: 'Facebook' }).click();
  }

  async isAuthenticated(): Promise<boolean> {
    const hasUnAuthButton = await this.page
      .locator('button:has-text("Registrarse")')
      .isVisible({ timeout: 2000 })
      .catch(() => false);
    return !hasUnAuthButton;
  }
}
