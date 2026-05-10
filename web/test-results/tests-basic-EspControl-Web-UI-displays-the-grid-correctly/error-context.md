# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/basic.spec.ts >> EspControl Web UI >> displays the grid correctly
- Location: tests/basic.spec.ts:36:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('.sp-topbar')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.sp-topbar')
    9 × locator resolved to <div class="sp-topbar sp-hidden">…</div>
      - unexpected value "hidden"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]: EspControl
    - generic [ref=e6]:
      - link "Screen" [ref=e7] [cursor=pointer]:
        - /url: "#"
      - link "Settings" [ref=e8] [cursor=pointer]:
        - /url: "#"
      - link "Docs" [ref=e9] [cursor=pointer]:
        - /url: https://github.com/jtenniswood/espcontrol
        - text: Docs
  - main [ref=e10]:
    - generic [ref=e13]:
      - generic [ref=e18] [cursor=pointer]: sensor.date
      - generic [ref=e21] [cursor=pointer]: Led strip
      - generic [ref=e24] [cursor=pointer]: weather.forecast_thuis
      - generic [ref=e33] [cursor=pointer]: Zonneschermen
  - link "Buy Me A Coffee" [ref=e50] [cursor=pointer]:
    - /url: https://www.buymeacoffee.com/jtenniswood
    - img "Buy Me A Coffee" [ref=e51]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('EspControl Web UI', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Go to the dev server. Assumes Vite is running.
  6  |     await page.goto('http://localhost:5173');
  7  |   });
  8  | 
  9  |   test('loads the application and shows the header', async ({ page }) => {
  10 |     // Check if brand is visible
  11 |     await expect(page.locator('.sp-brand')).toContainText('EspControl');
  12 |     
  13 |     // Check if the two tabs are present
  14 |     const tabs = page.locator('.sp-tab');
  15 |     await expect(tabs).toHaveCount(3); // Screen, Settings, Docs
  16 |     await expect(tabs.nth(0)).toContainText('Screen');
  17 |     await expect(tabs.nth(1)).toContainText('Settings');
  18 |   });
  19 | 
  20 |   test('switches between screen and settings tabs', async ({ page }) => {
  21 |     // Click Settings
  22 |     await page.locator('.sp-tab').nth(1).click();
  23 |     
  24 |     // Verify Settings tab is active
  25 |     await expect(page.locator('.sp-tab').nth(1)).toHaveClass(/active/);
  26 |     await expect(page.locator('.sp-config')).toBeVisible();
  27 | 
  28 |     // Click Screen
  29 |     await page.locator('.sp-tab').nth(0).click();
  30 |     
  31 |     // Verify Screen tab is active
  32 |     await expect(page.locator('.sp-tab').nth(0)).toHaveClass(/active/);
  33 |     await expect(page.locator('.sp-screen')).toBeVisible();
  34 |   });
  35 | 
  36 |   test('displays the grid correctly', async ({ page }) => {
  37 |     // Verify grid topbar
> 38 |     await expect(page.locator('.sp-topbar')).toBeVisible();
     |                                              ^ Error: expect(locator).toBeVisible() failed
  39 |     
  40 |     // Check that we have a clock
  41 |     await expect(page.locator('.sp-clock')).toBeVisible();
  42 |   });
  43 | });
  44 | 
```