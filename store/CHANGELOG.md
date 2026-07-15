# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- EditorConfig configuration for consistent editor settings across the team
- Prettier configuration for automated code formatting
- ESLint Flat Config with official Playwright recommended rules
- Lint, format, and typecheck npm scripts
- VS Code workspace settings (format on save, ESLint auto-fix, organize imports)
- VS Code recommended extensions (Playwright, ESLint, Prettier, EditorConfig)
- CONTRIBUTING.md with onboarding guide for QA engineers
- docs/ARCHITECTURE.md with current architecture, ADRs, and roadmap
- GitHub Actions workflow (PR triggers on dev/main, daily cron, typecheck, lint, tests, artifact upload on failure)

- `BasePage`: `waitForPageLoad()`, `acceptCookies()`, `getPriceByLabel()` methods
- `ClerkComponent`: shared Clerk helpers (`clickContinue`, SSO buttons, `isAuthenticated`)
- `SignInPage`: login Page Object for `/sign-in`
- `SignUpPanel`: registration Page Object for Clerk overlay
- `HomePage`: home page with `isLoaded()` improved, cookie acceptance integrated
- `ProductCatalogPage`: collection-based catalog (`/collection/<slug>`)
- `CartPage`: cart with product detection, subtotal/total extraction
- `CheckoutPage`: checkout with shipping section, order summary, subtotal/total
- Playwright fixtures for all 8 Page Objects (`homePage`, `catalogPage`, `cartPage`, `checkoutPage`, `signInPage`, `signUpPanel`, `loginPage`, `testUsers`)

- `auth.setup.ts`: storageState authentication via Clerk
- `storageState` project dependency in `playwright.config.ts`
- Test data files: `data/users.json`, `data/checkout.json` (typed imports)

- Smoke test suite (5 tests, `@smoke` tag, `test.step()`):
  - Home: navigation and section visibility
  - Login: full Clerk authentication flow
  - Catalog: product collection with buy buttons
  - Cart: add product, verify subtotal/total, checkout button
  - Checkout: add products, verify shipping + order summary + totals

### Removed

- `cross-env` dependency (unused)
- Dead code: `utils/assertions.ts` (no references)
- All `waitForTimeout()` calls from smoke tests (replaced with Web-First Assertions)

### Changed

- `package.json`: added devDependencies, removed unused `cross-env`, added new scripts
- `.gitignore`: unblocked `.vscode/settings.json`, added `auth.json`
- `LoginPage`: marked as `@deprecated` (will be removed after test migration)
- `fixtures/test.fixtures.ts`: cleaned up redundant type annotations, added 5 new fixtures
- `.env` and `.env.example`: complete with all 10 required variables
- `playwright.config.ts`: added `setup` project with `storageState` dependencies
- `README.md`: rewritten to reflect current architecture and workflow
- All smoke tests: replaced hardcoded URLs with relative paths via `baseURL`
