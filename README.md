# Project: testing

This repository will be used for Playwright end-to-end tests.

## Overview of folders

- [eia](eia/) — placeholder for EIA-related assets.
- [end-to-end](end-to-end/) — Playwright test files and fixtures should live here.
- [server](server/) — server code / test server.
  - [server/db](server/db/) — database-related test fixtures or local DB.
  - [server/shop](server/shop/) — shop/service mocks.
- [store](store/) — store-related assets or fixtures.
- [.vscode/settings.json](.vscode/settings.json) — editor settings.

## Getting started with Playwright

1. Ensure Node.js is installed (Node 14+ recommended).
2. From the repository root, install Playwright test runner:
```sh
npm install -D @playwright/test
npx playwright install
```
3. Initialize Playwright (optional, scaffolds a config and example tests):
```sh
npx playwright test --init
```
4. Put your tests under the [end-to-end](end-to-end/) folder (Playwright default is `tests/`, but configure `testDir` in `playwright.config.ts` to point to `end-to-end`).

Example minimal npm scripts (add to `package.json`):
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

## Recommended structure inside end-to-end
- end-to-end/playwright.config.ts — Playwright config (projects, reporter, testDir).
- end-to-end/tests/*.spec.ts — test files.
- end-to-end/fixtures/ — test fixtures and helpers.

## Running tests
- Run all tests:
```sh
npm run test:e2e
```
- Run a single test file:
```sh
npx playwright test end-to-end/tests/example.spec.ts
```

## Notes
- Keep test-only services and mock data under [server](server/) and [store](store/) to avoid polluting production code.
- Update `playwright.config.ts` to point `testDir` to `end-to-end` and configure browsers/projects as needed.