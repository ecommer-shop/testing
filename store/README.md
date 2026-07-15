# ECOMMER Shop — Test Automation Framework

Automated E2E testing for **ECOMMER Shop** frontend using **Playwright**, **TypeScript**, and **Page Object Model**.

## Stack

| Component  | Version              |
| ---------- | -------------------- |
| Playwright | 1.61                 |
| TypeScript | 6.x                  |
| Node.js    | 18+                  |
| Auth       | Clerk (storageState) |
| CI/CD      | GitHub Actions       |

## Quick Start

```bash
npm install
npm run install:browsers
cp .env.example .env
# Edit .env and set LOGIN_EMAIL / LOGIN_PASSWORD
npm test
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
BASE_URL=https://ecommer.shop/es
LOGIN_EMAIL=your-qa-account@email.com
LOGIN_PASSWORD=your-password
```

All variables are documented in `.env.example`.

## Authentication

Authentication uses Playwright `storageState`. The `setup` project authenticates once via Clerk at `/sign-in` and saves the session to `auth.json`. All browser projects reuse this state — no login per test.

```
npm test
  └── setup project (auth.setup.ts)
        └── SignInPage.login() → auth.json
  └── chromium / firefox / webkit
        └── storageState: auth.json
```

Without credentials, `auth.setup.ts` generates an empty `auth.json` and tests run unauthenticated.

## Test Suites

### Smoke (`npm run test:smoke`)

Tests críticos del negocio. 100% deterministas, ejecutan en < 2 minutos.

| Test  | Description                               |
| ----- | ----------------------------------------- |
| Home  | Navigate to home, verify sections visible |
| Login | Full Clerk authentication flow            |

### Integration (`npm run test:integration`)

Tests que modifican estado server-side o tienen dependencias externas.

| Test     | Description                                                         |
| -------- | ------------------------------------------------------------------- |
| Catalog  | Product collection with buy buttons                                 |
| Cart     | Add product, verify cart contents, subtotal/total                   |
| Checkout | Add ≥3 products, verify checkout page with shipping + order summary |

Checkout está en integración porque el carrito de Vendure es server-side. Dos workers paralelos usando la misma sesión causan condición de carrera. Se recomienda ejecutar con `--workers=1`.

### Legacy (`tests/authentication/`)

Tests using the deprecated `LoginPage`. These fail against the real site. Pending migration.

## Scripts

| Command                    | Description                                               |
| -------------------------- | --------------------------------------------------------- |
| `npm test`                 | Full suite (3 browsers)                                   |
| `npm run test:smoke`       | Smoke suite (Home + Login, 3 browsers)                    |
| `npm run test:integration` | Integration suite (Catalog + Cart + Checkout, 3 browsers) |
| `npm run test:chromium`    | All tests, Chromium only                                  |
| `npm run test:headed`      | Headed mode                                               |
| `npm run test:debug`       | Debug mode                                                |
| `npm run typecheck`        | TypeScript compilation check                              |
| `npm run lint`             | ESLint (Playwright rules)                                 |
| `npm run format`           | Prettier auto-format                                      |
| `npm run format:check`     | Check formatting only                                     |

## Architecture

```
pages/
├── BasePage.ts              ← acceptCookies(), waitForPageLoad(), getPriceByLabel()
├── components/
│   └── ClerkComponent.ts    ← clickContinue(), isAuthenticated(), SSO buttons
├── SignInPage.ts            ← /sign-in, login(email, pass)
├── SignUpPanel.ts           ← registration overlay
├── HomePage.ts              ← / (home)
├── ProductCatalogPage.ts    ← /collection/<slug>
├── CartPage.ts              ← /cart
├── CheckoutPage.ts          ← /checkout
└── LoginPage.ts             ← @deprecated

fixtures/
└── test.fixtures.ts         ← 8 fixtures + testUsers from JSON

tests/
├── auth.setup.ts            ← storageState setup
├── smoke/
│   ├── home.spec.ts         ← @smoke
│   └── login.spec.ts        ← @smoke
├── integration/
│   ├── catalog.spec.ts
│   ├── cart.spec.ts
│   └── checkout.spec.ts
└── authentication/          ← legacy (@deprecated)
```

## Adding a New Page Object

1. Create `pages/NewPage.ts` extending `BasePage`
2. Use `getByRole()`, `getByLabel()`, or `text=` selectors
3. Add fixture in `fixtures/test.fixtures.ts`
4. Create test in `tests/smoke/` with `test.step()` and `@smoke` tag

## Adding a New Smoke Test

```typescript
test('should do something @smoke', async ({ newPage, page }) => {
  await test.step('Step description', async () => {
    // action
  });
  await test.step('Verify result', async () => {
    await expect(locator).toBeVisible();
  });
});
```

## CI/CD

GitHub Actions workflow at `.github/workflows/e2e.yml`:

- Triggered on PR to `dev` / `main`
- Daily cron (Mon–Fri 6am UTC)
- Steps: checkout → install → typecheck → lint → test
- Artifacts uploaded on failure

## Reports

Playwright generates `playwright-report/` and `test-results/` with HTML reports, traces, videos, and screenshots (on failure).

## Maintainer

William Jimenez — ECOMMER Shop Automation Project
