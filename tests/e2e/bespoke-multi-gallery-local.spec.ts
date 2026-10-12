import { test, expect } from '@playwright/test';

test('local bespoke page can load a Firestore fabric with multi-image gallery', async ({ page }) => {
  await page.goto('/bespoke', { waitUntil: 'networkidle' });

  await page.getByRole('button', { name: /suit/i }).click();
  await expect(page.getByRole('heading', { name: /initialize material/i })).toBeVisible();
  
    // Wait for fabric cards to load and click first
    const firstFabricCard = page.locator('main').locator('button').first();
    await firstFabricCard.waitFor({ state: 'visible', timeout: 60000 });
    await firstFabricCard.click();

    // Wait briefly for selection to register
    await page.waitForTimeout(500);

  await page.getByRole('button', { name: /mount_material/i }).click();
  await expect(page.getByText(/current_protocol/i)).toBeVisible();
  
    // Verify image gallery loaded in VisualEngine
    await expect(page.locator('section img[alt="Suit Preview Main"]')).toBeVisible({ timeout: 30000 });
});
