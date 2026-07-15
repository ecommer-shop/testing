import { BasePage } from './BasePage.js';
import { ClerkComponent } from './components/ClerkComponent.js';
import type { Page } from '@playwright/test';

export interface SignUpData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}

export class SignUpPanel extends BasePage {
  readonly clerk: ClerkComponent;

  constructor(page: Page) {
    super(page);
    this.clerk = new ClerkComponent(page);
  }

  async open(): Promise<void> {
    await this.page.getByRole('button', { name: 'Registrarse' }).click();
    await this.page.getByLabel('Nombre').waitFor({ state: 'visible', timeout: 5000 });
  }

  async register(data: SignUpData): Promise<void> {
    await this.page.getByLabel('Nombre').fill(data.firstName);
    await this.page.getByLabel('Apellido').fill(data.lastName);
    await this.page.getByLabel('Nombre de usuario').fill(data.username);
    await this.page.getByLabel('Correo electrónico').fill(data.email);
    await this.page.getByLabel('Contraseña').fill(data.password);

    if (data.acceptTerms) {
      await this.page.getByLabel('I agree').check();
    }

    await this.clerk.clickContinue();
  }

  async isLoaded(): Promise<boolean> {
    return this.page.getByLabel('Nombre').isVisible();
  }
}
