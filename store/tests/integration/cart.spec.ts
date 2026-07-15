import { test, expect } from '../../fixtures/test.fixtures.js';
import { CartPage } from '../../pages/CartPage.js';

test.describe('Cart', () => {
  test('should add product and display it in cart @regression @cart', async ({ guestPage }) => {
    test.setTimeout(60000);

    await test.step('Navigate to product and add to cart', async () => {
      await guestPage.goto('https://ecommer.shop/es/product/champinones-orellana');

      const addButton = guestPage.locator('button:has-text("Agregar al carrito")');
      await expect(addButton).toBeVisible({ timeout: 15000 });
      await addButton.click();
    });

    const cartPage = new CartPage(guestPage);

    await test.step('Navigate to cart', async () => {
      await cartPage.navigate();
      await expect(cartPage.isLoaded()).resolves.toBe(true);
    });

    await test.step('Verify product in cart', async () => {
      await expect(cartPage.hasProducts()).resolves.toBe(true);
    });

    await test.step('Verify price is displayed', async () => {
      const subtotal = await cartPage.getSubtotal();
      const total = await cartPage.getTotal();
      expect(subtotal).not.toBe('');
      expect(total).not.toBe('');
    });

    await test.step('Verify checkout option exists', async () => {
      const bodyText = await guestPage.locator('body').innerText();
      expect(bodyText).toContain('Ir al pago');
    });
  });
});
