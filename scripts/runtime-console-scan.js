const { chromium } = require('playwright');

(async () => {
  const base = process.env.BASE_URL || 'http://127.0.0.1:3005';
  const routes = ['/', '/collection', '/catalog', '/booking', '/ai-advisor', '/process'];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const results = [];

  for (const route of routes) {
    const page = await context.newPage();
    const errors = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(`console: ${msg.text()}`);
      }
    });

    page.on('pageerror', (err) => {
      errors.push(`pageerror: ${err.message}`);
    });

    try {
      const response = await page.goto(base + route, {
        waitUntil: 'networkidle',
        timeout: 45000,
      });
      await page.waitForTimeout(1000);
      results.push({ route, status: response ? response.status() : 'NO_RESPONSE', errors });
    } catch (error) {
      results.push({ route, status: 'NAV_FAILED', errors: [`nav: ${error.message}`] });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log('=== Runtime Console Error Scan ===');
  let total = 0;

  for (const result of results) {
    console.log(`\n[${result.route}] status=${result.status}`);
    if (!result.errors.length) {
      console.log('  - no runtime console errors');
      continue;
    }

    for (const error of result.errors) {
      total += 1;
      console.log(`  - ${error}`);
    }
  }

  console.log(`\nTOTAL_ERRORS=${total}`);
})();
