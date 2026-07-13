import { test as setup } from '@playwright/test';
import { SignInPage } from '../pages/SignInPage.js';

setup('authenticate', async ({ page }) => {
  const email = process.env.LOGIN_EMAIL;
  const password = process.env.LOGIN_PASSWORD;

  if (email && password) {
    const signInPage = new SignInPage(page);
    await signInPage.navigate();
    await signInPage.login(email, password);
    await page.waitForURL((url) => !url.pathname.includes('sign-in'), { timeout: 30000 });
    await page.context().storageState({ path: 'auth.json' });
  } else {
    await page.context().storageState({ path: 'auth.json' });
  }
});
