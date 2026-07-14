import { test, expect } from '../../fixtures/test.fixtures.js';

test.describe('Product catalog', () => {
  test('should display products @regression @catalog', async ({ catalogPage }) => {
    await test.step('Navigate to a product collection', async () => {
      await catalogPage.navigate();
    });

    await test.step('Verify products are displayed', async () => {
      await expect(catalogPage.hasProducts()).resolves.toBe(true);
    });

    await test.step('Verify buy buttons are present', async () => {
      await expect(catalogPage.buyButtons.first()).toBeVisible();
    });
  });
});
