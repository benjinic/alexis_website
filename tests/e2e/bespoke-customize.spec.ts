import { test, expect } from '@playwright/test';

test('bespoke customize flow renders toolbar and sidebar and can return to fabric', async ({ page }) => {
  await page.goto('/bespoke', { waitUntil: 'networkidle' });

  await expect(page.getByRole('heading', { name: /select protocol/i })).toBeVisible();
  await page.getByRole('button', { name: /suit/i }).click();

  await expect(page.getByRole('heading', { name: /initialize material/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /mount_material/i })).toBeVisible();
  
    // Wait for fabric cards to load in main grid and click first
    const firstFabricCard = page.locator('main').locator('button').first();
    await firstFabricCard.waitFor({ state: 'visible', timeout: 30000 });
    await firstFabricCard.click();
  

  await page.getByRole('button', { name: /mount_material/i }).click();

  await expect(page.getByText(/protocol:/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /back to fabric/i })).toBeVisible();
  await expect(page.getByText(/current_protocol/i)).toBeVisible();
  await expect(page.getByText(/protocol_details/i)).toBeVisible();
  await expect(page.getByText(/total_estimate/i)).toBeVisible();

  const protocolSummary = page.locator('aside').filter({ hasText: 'CURRENT_PROTOCOL' });
  await expect(protocolSummary.getByText(/fabric:/i)).toBeVisible();
  await expect(protocolSummary.getByText(/lapel:/i)).toBeVisible();
  await expect(protocolSummary.getByText(/construction:/i)).toBeVisible();

  await page.getByRole('button', { name: /back to fabric/i }).click();

  await expect(page.getByRole('heading', { name: /initialize material/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /mount_material/i })).toBeVisible();
  await expect(page.getByText(/current_protocol/i)).toHaveCount(0);
});