import { test, expect } from '@playwright/test';

test.describe('EspControl Web UI', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the dev server. Assumes Vite is running.
    await page.goto('http://localhost:5173');
  });

  test('loads the application and shows the header', async ({ page }) => {
    // Check if brand is visible
    await expect(page.locator('.sp-brand')).toContainText('EspControl');
    
    // Check if the two tabs are present
    const tabs = page.locator('.sp-tab');
    await expect(tabs).toHaveCount(3); // Screen, Settings, Docs
    await expect(tabs.nth(0)).toContainText('Screen');
    await expect(tabs.nth(1)).toContainText('Settings');
  });

  test('switches between screen and settings tabs', async ({ page }) => {
    // Click Settings
    await page.locator('.sp-tab').nth(1).click();
    
    // Verify Settings tab is active
    await expect(page.locator('.sp-tab').nth(1)).toHaveClass(/active/);
    await expect(page.locator('.sp-config')).toBeVisible();

    // Click Screen
    await page.locator('.sp-tab').nth(0).click();
    
    // Verify Screen tab is active
    await expect(page.locator('.sp-tab').nth(0)).toHaveClass(/active/);
    await expect(page.locator('.sp-screen')).toBeVisible();
  });

  test('displays the grid correctly', async ({ page }) => {
    // Verify grid topbar exists (it may be hidden depending on state)
    await expect(page.locator('.sp-topbar')).toBeAttached();
    
    // Check that we have a clock
    await expect(page.locator('.sp-clock')).toBeAttached();
  });
});
