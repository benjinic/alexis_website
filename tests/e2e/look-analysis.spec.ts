import { test, expect } from '@playwright/test';
import path from 'path';

test('visual intelligence upload flow renders analysis result', async ({ page }) => {
  await page.goto('/visual-intelligence', { waitUntil: 'networkidle' });

  await page.getByRole('button', { name: /UPLOAD LOOK/i }).click();

  const filePath = path.resolve(process.cwd(), 'public', 'ALEXIS BESPOKE.png');
  await page.locator('input[type="file"]').setInputFiles(filePath);

  const responsePromise = page.waitForResponse(
    response => response.url().includes('/api/look-analysis') && response.request().method() === 'POST'
  );

  await page.getByRole('button', { name: /ANALYZE LOOK/i }).click();

  const response = await responsePromise;
  expect(response.ok()).toBeTruthy();

  await expect(page.getByText('Style Score')).toBeVisible();
  await expect(page.getByText(/Analysis Failed/i)).toHaveCount(0);
});
