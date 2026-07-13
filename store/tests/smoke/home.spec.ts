import { test, expect } from '../../fixtures/test.fixtures.js';
import { env } from '../../utils/config.js';

test.describe('Home page', () => {
  test('should display content @smoke', async ({ homePage, page }) => {
    await test.step('Navigate to home page', async () => {
      await homePage.navigate();
    });

    await test.step('Verify page loads on the correct domain', async () => {
      const origin = new URL(env.BASE_URL).origin;
      await expect(page).toHaveURL(new RegExp(`^${origin}/(es|en)?/?$`));
      await expect(page.locator('body')).toBeVisible();
    });

    await test.step('Verify home page sections are visible', async () => {
      await expect(homePage.isLoaded()).resolves.toBe(true);
    });
  });
});
