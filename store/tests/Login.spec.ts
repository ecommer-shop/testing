import { test, expect } from '@playwright/test';
//import 'dotenv/config';
test('test', async ({ page }) => {
  await page.goto(process.env.BASE_URL!);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(process.env.USER_EMAIL!);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.USER_PASSWORD!);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByLabel('Main').getByRole('link', { name: 'Electronics' }).click();
  await page.getByRole('button', { name: /comprar|add to cart/i }).first().click();
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await page.getByRole('link', { name: 'Shopping Cart' }).click();
  console.log('✅ TODO SALIÓ PERFECTO ok 🚀');
});