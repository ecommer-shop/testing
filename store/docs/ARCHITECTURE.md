# Architecture

## 1. Estado Actual

El framework es un proyecto de automatización E2E para ECOMMER Shop frontend. Está en fase inicial de construcción con la infraestructura base montada y los primeros Page Objects y tests funcionando (aunque con selectores pendientes de validar contra el DOM real).

### Stack

| Componente | Versión | Rol                              |
| ---------- | ------- | -------------------------------- |
| Playwright | 1.61    | Test runner + browser automation |
| TypeScript | 6.0     | Lenguaje, tipado estático        |
| Node.js    | 18+     | Runtime                          |
| dotenv     | 17.4    | Carga de variables de entorno    |

### Tooling

| Herramienta    | Archivo                     | Rol                                        |
| -------------- | --------------------------- | ------------------------------------------ |
| ESLint         | `eslint.config.mjs`         | Linting con reglas oficiales de Playwright |
| Prettier       | `.prettierrc`               | Formateo automático de código              |
| EditorConfig   | `.editorconfig`             | Consistencia entre editores                |
| GitHub Actions | `.github/workflows/e2e.yml` | CI/CD en PRs y schedule diario             |

---

## 2. Principios de Diseño

1. **Simplicidad sobre completitud.** Cada abstracción debe justificar su existencia con uso real en al menos 3 lugares. No se añaden capas por anticipación.

2. **Playwright nativo sobre wrappers propios.** Fixtures, `test.step()`, `storageState`, y `project` de Playwright reemplazan patrones que en Selenium requerían código custom. No se envuelve lo que el framework ya resuelve.

3. **Page Object Model con fixtures.** Los Page Objects se inyectan vía el sistema de fixtures de Playwright. Esto elimina `new` en los tests y proporciona tipado completo.

4. **Datos estáticos en JSON.** Sin Faker ni Builders. Los datos de prueba son archivos JSON predecibles y auditables. Se reevalúa cuando el volumen de variaciones de datos supere las 50 combinaciones.

5. **Componentes difieren su extracción.** Header, footer, navbar y otros componentes compartidos viven como métodos en cada Page Object hasta que la duplicación en 8+ páginas justifique su propia clase.

6. **Crecimiento por dolor, no por anticipación.** Cada fase de evolución se dispara cuando el equipo siente fricción real, no por planificación especulativa.

---

## 3. Estructura de Carpetas

```
store/
├── .github/
│   └── workflows/
│       └── e2e.yml
├── .vscode/
│   ├── settings.json
│   └── extensions.json
├── data/                          ← JSON con datos de prueba (users, products, checkout)
│   ├── checkout/
│   ├── products/
│   └── users/
├── docs/
│   └── ARCHITECTURE.md            ← este documento
├── fixtures/
│   └── test.fixtures.ts           ← DI: inyecta Page Objects en los tests
├── pages/
│   ├── BasePage.ts                ← acceptCookies(), waitForPageLoad(), getPriceByLabel()
│   ├── components/
│   │   └── ClerkComponent.ts      ← clickContinue(), isAuthenticated(), SSO
│   ├── SignInPage.ts              ← /sign-in, login(email, pass)
│   ├── SignUpPanel.ts             ← registration overlay
│   ├── HomePage.ts                ← / (home)
│   ├── ProductCatalogPage.ts      ← /collection/<slug>
│   ├── CartPage.ts                ← /cart
│   ├── CheckoutPage.ts            ← /checkout
│   └── LoginPage.ts               ← @deprecated
├── tests/
│   ├── auth.setup.ts              ← storageState authentication
│   ├── smoke/                     ← Smoke Suite (Home + Login, @smoke)
│   │   ├── home.spec.ts
│   │   └── login.spec.ts
│   ├── integration/               ← Integration Suite (Catalog + Cart + Checkout)
│   │   ├── catalog.spec.ts
│   │   ├── cart.spec.ts
│   │   └── checkout.spec.ts
│   ├── authentication/            ← legacy (@deprecated)
├── utils/
│   └── config.ts                  ← parseo tipado de variables de entorno
├── .editorconfig
├── .env                           ← local (gitignored)
├── .env.example                   ← plantilla documentada
├── .gitignore
├── .prettierrc
├── .prettierignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── eslint.config.mjs
├── package.json
├── playwright.config.ts
├── README.md
└── tsconfig.json
```

---

## 4. Flujo de Ejecución de una Prueba

```
1. Playwright lee playwright.config.ts
     ↓
2. Carga variables de entorno desde utils/config.ts (dotenv)
     ↓
3. Inicializa el proyecto (chromium, firefox, o webkit)
     ↓
4. Crea un browser context con viewport, timeouts, traces
     ↓
5. El sistema de fixtures inyecta los Page Objects solicitados
     ↓
6. El test llama a pageObject.navigate()
     ↓
7. El Page Object usa BasePage.goto() o page.goto() directo
     ↓
8. El test ejecuta acciones sobre el Page Object
     ↓
9. El test realiza assertions con expect de Playwright
     ↓
10. Playwright captura screenshot, video y trace on failure
     ↓
11. El reporter genera HTML + JUnit XML
```

### Ejemplo concreto

```
test('should authenticate @smoke', async ({ signInPage }) => {
  await test.step('Navigate to sign-in', async () => {
    await signInPage.navigate();
  });
  await test.step('Fill credentials', async () => {
    await signInPage.login(email, password);
  });
  await test.step('Verify authenticated', async () => {
    await expect(signInPage.clerk.isAuthenticated()).resolves.toBe(true);
  });
});
```

El test no instancia `SignInPage`. El fixture (`test.fixtures.ts`) lo crea con el `page` del contexto actual y lo inyecta automáticamente.

---

## 5. Decisiones Arquitectónicas (ADR)

### ADR-001: Page Object Model con Playwright Fixtures como DI

**Decisión:** Usar el sistema de fixtures nativo de Playwright para inyectar Page Objects en los tests.

**Alternativas rechazadas:**

- Instanciar `new LoginPage(page)` en cada test → boilerplate repetitivo
- Service Locator o contenedor DI propio → complejidad innecesaria

**Consecuencias:**

- Cada Page Object recibe `Page` por constructor
- `test.fixtures.ts` es el punto único de registro
- TypeScript infiere tipos automáticamente en los tests

---

### ADR-002: Component Object Model diferido

**Decisión:** Los componentes UI compartidos (header, footer, navbar, cookie banner) permanecen como métodos privados dentro de cada Page Object.

**Gatillo para reevaluar:** 8+ Page Objects con lógica de componente duplicada.

**Racional:** Con 4 Page Objects actuales, la duplicación es mínima. Extraer componentes ahora añadiría abstracción sin beneficio proporcional.

---

### ADR-003: Datos de prueba en JSON estático

**Decisión:** Los datos de prueba se almacenan en archivos JSON bajo `data/`. Sin Faker ni Builder pattern.

**Alternativas rechazadas:**

- Faker → introduce no-determinismo, dificulta reproducir fallos
- Factory/Builder → sobreingeniería para <500 tests

**Gatillo para reevaluar:** 50+ combinaciones de datos o necesidad de datos únicos por ejecución.

---

### ADR-004: ESLint Flat Config con reglas oficiales de Playwright

**Decisión:** `eslint.config.mjs` usando `playwright.configs['flat/recommended']` como base.

**Personalizaciones aplicadas:**

- `playwright/no-skipped-test`: off (skips condicionales son válidos cuando dependen de credenciales)
- `@typescript-eslint/no-unused-vars`: variables con prefijo `_` ignoradas

---

### ADR-005: Autenticación vía storageState

**Decisión:** Usar `storageState` de Playwright con un proyecto `setup` en `playwright.config.ts` para compartir estado de autenticación entre tests.

**Racional:** Cada test haciendo login por UI es lento (30s+ por test) y frágil. `storageState` comparte cookies + localStorage entre tests con un solo login real.

**Estado:** Implementado en Fase 2. `auth.setup.ts` autentica vía Clerk, guarda `auth.json`, y los 3 navegadores lo reutilizan. Sin credenciales configuradas, se genera un `auth.json` vacío para no bloquear la suite.

---

### ADR-006: Precios extraídos por escaneo de texto

**Decisión:** Los métodos `getSubtotal()` y `getTotal()` en `CartPage` y `CheckoutPage` extraen precios mediante escaneo de texto del `body`, no mediante selectores CSS específicos.

**Racional:** El sitio (Next.js + Tailwind) no tiene atributos `data-testid`. Los precios están en elementos sin identificadores estables. El escaneo de líneas de texto es más robusto frente a cambios de layout que los selectores CSS por posición.

**Consecuencias:** Centralizado en `BasePage.getPriceByLabel()` para evitar duplicación entre Page Objects.

---

## 6. Roadmap de Evolución

| Fase       | Contenido                                                                        | Estado         |
| ---------- | -------------------------------------------------------------------------------- | -------------- |
| **Fase 1** | Tooling (EditorConfig, Prettier, ESLint, CI, docs)                               | ✅ Completada  |
| **Fase 2** | Corregir selectores contra DOM real, storageState, BasePage, SignIn/SignUp       | ✅ Completada  |
| **Fase 3** | Suite Smoke (Home, Login, Catálogo, Carrito, Checkout) + CartPage + CheckoutPage | ✅ Completada  |
| **Fase 4** | Evaluar Component Object Model si la duplicación lo justifica                    | 📋 Planificado |
| **Fase 5** | Data Factory con Faker, API helpers, visual testing                              | 📋 Futuro      |

## 7. Smoke Suite vs Integration Suite

### Smoke Suite (`tests/smoke/`)

Tests que validan el critical path del negocio. Requisitos:

- 100% deterministas (sin flakiness)
- No modifican estado server-side compartido
- Ejecutan en < 2 minutos
- Si fallan, indican un problema crítico en producción

Actualmente: Home (navegación) y Login (autenticación Clerk).

### Integration Suite (`tests/integration/`)

Tests que dependen de estado server-side o requieren aislamiento entre workers. Incluyen:

- Catalog: catálogo de productos
- Cart: añadir al carrito, verificar subtotal/total
- Checkout: flujo de pago (depende del carrito de Vendure, server-side)

Checkout fue movido de Smoke a Integration porque el carrito de Vendure es server-side y compartido entre workers al usar el mismo `storageState`. Dos workers concurrentes causan condición de carrera sobre el carrito.

**Ejecución:**

```bash
npm run test:smoke        # Home + Login (3 browsers)
npm run test:integration  # Catalog + Cart + Checkout (3 browsers)
npm test                  # Full suite
```
