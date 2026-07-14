import { test, expect } from '../../fixtures/test.fixtures.js';

test.describe('Checkout', () => {
  test('should display checkout page @regression @checkout', async ({ checkoutPage, page }) => {
    test.setTimeout(60000);

    await test.step('Add products to meet minimum order', async () => {
      await page.goto('https://ecommer.shop/es/product/champinones-orellana');

      const addBtn = page.locator('button:has-text("Agregar al carrito")');
      await addBtn.waitFor({ state: 'visible', timeout: 15000 });

      for (let i = 0; i < 3; i++) {
        await addBtn.click();
      }
    });

    await test.step('Navigate to checkout', async () => {
      await checkoutPage.navigate();
      await expect(checkoutPage.isLoaded()).resolves.toBe(true);
    });

    await test.step('Verify checkout sections are visible', async () => {
      await expect(checkoutPage.hasShippingSection()).resolves.toBe(true);
      await expect(checkoutPage.hasOrderSummary()).resolves.toBe(true);
    });

    await test.step('Verify order total is displayed', async () => {
      const subtotal = await checkoutPage.getSubtotal();
      const total = await checkoutPage.getTotal();
      expect(subtotal).not.toBe('');
      expect(total).not.toBe('');
    });
  });
});
