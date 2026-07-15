import { test, expect } from '../../fixtures/test.fixtures.js';
import { env } from '../../utils/config.js';

test.describe('Login page', () => {
  test('should display login form', async ({ loginPage }) => {
    await loginPage.navigate();

    expect(await loginPage.getCurrentUrl()).toMatch(/.*login/);
    expect(await loginPage.isLoaded()).toBeTruthy();
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login('invalid@example.com', 'wrong-password');

    expect(await loginPage.hasErrorMessage()).toBeTruthy();
    expect(await loginPage.getErrorMessage()).not.toBe('');
  });

  test('should login successfully with valid credentials', async ({ loginPage }) => {
    test.skip(
      !env.LOGIN_EMAIL || !env.LOGIN_PASSWORD,
      'Valid login credentials are not configured',
    );

    await loginPage.navigate();
    await loginPage.login(env.LOGIN_EMAIL, env.LOGIN_PASSWORD);

    expect(await loginPage.getCurrentUrl()).not.toMatch(/.*login/);
    expect(await loginPage.isBodyVisible()).toBeTruthy();
  });
});
