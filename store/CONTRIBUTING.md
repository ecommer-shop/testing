# Contributing

## Prerequisites

- Node.js 18+
- npm 9+

## Getting Started

```bash
git clone <repository-url>
cd testing/store
npm install
npm run install:browsers
```

## Development Workflow

### Before Writing Code

```bash
npm install
npm run install:browsers
```

### While Writing Code

- Follow the Page Object Model pattern
- Use `data-testid` selectors when available; fall back to semantic selectors
- Use Playwright locators, never raw CSS strings
- Add `test.step()` blocks to make reports readable
- Tag tests with `@smoke`, `@regression`, or `@critical`

### Before Committing

```bash
npm run typecheck
npm run lint
npm run format:check
```

Fix any errors before committing. Use `npm run format` to auto-fix formatting.

### Branching

```
main
  └── dev
        └── feature/<name>
```

Pull Requests target `dev`. Never commit directly to `main`.

## Test Conventions

### Test Structure

```typescript
import { test, expect } from '../fixtures/test.fixtures';

test.describe('Feature name', () => {
  test('should do something @smoke', async ({ pageObject }) => {
    await test.step('Navigate to the page', async () => {
      await pageObject.navigate();
    });

    await test.step('Perform action', async () => {
      await pageObject.doAction();
    });

    await test.step('Verify result', async () => {
      await expect(pageObject.resultLocator).toBeVisible();
    });
  });
});
```

### Selectors

- Prefer `page.locator('[data-testid="login-email"]')`
- Fall back to semantic: `page.locator('input[type="email"]')`
- Never use XPath
- No hard `waitForTimeout` — use web-first assertions

### Page Objects

- Extend `BasePage`
- Expose locators as `readonly` properties
- Methods should return `Promise<void>` for actions, `Promise<boolean>` for state checks, or `Promise<string>` for text extraction
- Each Page Object maps to one page/route

## Code Quality

| Tool       | Command             |
| ---------- | ------------------- |
| TypeScript | `npm run typecheck` |
| ESLint     | `npm run lint`      |
| Prettier   | `npm run format`    |

CI will block PRs that fail these checks.

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add login page object
fix: correct product grid selector
chore: update playwright to 1.62
docs: add contributing guide
```
