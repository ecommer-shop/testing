import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { ProductCatalogPage } from '../pages/ProductCatalogPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { SignInPage } from '../pages/SignInPage.js';
import { SignUpPanel } from '../pages/SignUpPanel.js';
import users from '../data/users.json' with { type: 'json' };

export interface TestUser {
  email: string;
  password: string;
}

export interface TestUsers {
  validUser: TestUser;
  invalidUser: TestUser;
}

export type AppFixtures = {
  homePage: HomePage;
  catalogPage: ProductCatalogPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  loginPage: LoginPage;
  signInPage: SignInPage;
  signUpPanel: SignUpPanel;
  testUsers: TestUsers;
  guestPage: Page;
};

export const test = base.extend<AppFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  catalogPage: async ({ page }, use) => {
    await use(new ProductCatalogPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },

  signUpPanel: async ({ page }, use) => {
    await use(new SignUpPanel(page));
  },

  testUsers: async ({}, use) => {
    await use(users as TestUsers);
  },

  guestPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      viewport: { width: 1920, height: 1080 },
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

test.beforeEach(async ({}, testInfo) => {
  testInfo.attach('environment.json', {
    body: JSON.stringify(
      {
        baseURL: process.env.BASE_URL || 'not set',
        environment: process.env.ENV || 'default',
        ci: process.env.CI || 'false',
        timestamp: new Date().toISOString(),
      },
      null,
      2,
    ),
    contentType: 'application/json',
  });
});

export { expect };
