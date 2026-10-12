import { test, expect } from '@playwright/test';

test('bespoke customize flow shows step navigator and updates current protocol summary', async ({ page }) => {
  await page.goto('/bespoke', { waitUntil: 'networkidle' });

  await page.getByRole('button', { name: /suit/i }).click();
  await expect(page.getByRole('heading', { name: /initialize material/i })).toBeVisible();

  await page.getByRole('button', { name: /mount_material/i }).click();

  await expect(page.getByText('Design')).toBeVisible();
  await expect(page.getByText('Metrics')).toBeVisible();
  await expect(page.getByText(/current_protocol/i)).toBeVisible();

  const protocolSummary = page.locator('aside').filter({ hasText: 'CURRENT_PROTOCOL' });
  await expect(protocolSummary.getByText(/Lapel: 3\.5" Notch Lapel/i)).toBeVisible();
  await expect(protocolSummary.getByText(/Construction: Half-Canvassed/i)).toBeVisible();

  await page.getByRole('button', { name: /Peak Lapel/i }).click();
  await expect(protocolSummary.getByText(/Lapel: 4\.25" Peak Lapel/i)).toBeVisible();

  await page.getByRole('button', { name: /02 \/\/ CANVAS_CONSTRUCTION|CANVAS_CONSTRUCTION/i }).click();
  await page.getByRole('button', { name: /Fully-Canvassed/i }).click();
  await expect(protocolSummary.getByText(/Construction: Fully-Canvassed/i)).toBeVisible();
});