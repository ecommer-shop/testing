import { test, expect } from '../../fixtures/test.fixtures.js';

test.describe('Login', () => {
  test('should authenticate successfully @smoke', async ({ signInPage, page }) => {
    test.setTimeout(60000);
    const email = process.env.LOGIN_EMAIL;
    const password = process.env.LOGIN_PASSWORD;

    test.skip(!email || !password, 'LOGIN_EMAIL and LOGIN_PASSWORD are not configured');

    await test.step('Clear auth state and navigate to sign-in', async () => {
      await page.goto('/sign-in');
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      await page.context().clearCookies();
      await page.reload();
      await signInPage.isLoaded();
    });

    await test.step('Fill credentials and submit', async () => {
      await signInPage.login(email!, password!);
    });

    await test.step('Verify redirect from sign-in', async () => {
      await page.waitForURL((url) => !url.pathname.includes('sign-in'), { timeout: 30000 });
    });

    await test.step('Verify user is authenticated', async () => {
      await expect(signInPage.clerk.isAuthenticated()).resolves.toBe(true);
    });
  });
});
