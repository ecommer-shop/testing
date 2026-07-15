import { defineConfig, devices } from '@playwright/test';
import { env } from './utils/config.js';

export default defineConfig({
  testDir: './tests',
  timeout: env.DEFAULT_TIMEOUT,
  expect: {
    timeout: env.EXPECT_TIMEOUT,
  },
  forbidOnly: env.CI,
  retries: env.CI ? 2 : 0,
  workers: env.CI ? 2 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
  ],
  use: {
    baseURL: env.BASE_URL,
    headless: env.HEADLESS,
    ignoreHTTPSErrors: true,
    viewport: { width: 1920, height: 1080 },
    actionTimeout: env.DEFAULT_TIMEOUT,
    navigationTimeout: env.DEFAULT_TIMEOUT,
    screenshot: env.SCREENSHOT,
    video: env.VIDEO,
    trace: env.TRACE,
    launchOptions: {
      slowMo: 0,
    },
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'auth.json' },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: 'auth.json' },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: 'auth.json' },
      dependencies: ['setup'],
    },
  ],
  outputDir: 'test-results/',
});
