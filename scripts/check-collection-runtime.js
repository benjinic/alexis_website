const { chromium } = require('playwright');

(async () => {
  const url = 'http://127.0.0.1:3000/collection';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  const model404s = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });

  page.on('requestfailed', (req) => {
    failedRequests.push({
      url: req.url(),
      method: req.method(),
      failure: req.failure() ? req.failure().errorText : 'unknown',
    });
  });

  page.on('response', (res) => {
    const u = res.url();
    if (u.includes('/images/models/') && res.status() >= 400) {
      model404s.push({ url: u, status: res.status() });
    }
  });

  let navStatus = 'NO_RESPONSE';
  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    navStatus = resp ? resp.status() : 'NO_RESPONSE';
    await page.waitForTimeout(1500);
  } catch (e) {
    pageErrors.push(`Navigation failed: ${e.message}`);
  }

  await browser.close();

  console.log('=== Collection Runtime Check ===');
  console.log(`URL: ${url}`);
  console.log(`NAV_STATUS: ${navStatus}`);
  console.log(`CONSOLE_ERRORS: ${consoleErrors.length}`);
  console.log(`PAGE_ERRORS: ${pageErrors.length}`);
  console.log(`FAILED_REQUESTS: ${failedRequests.length}`);
  console.log(`MODEL_4XX: ${model404s.length}`);

  if (consoleErrors.length) {
    console.log('\n[Console Errors]');
    consoleErrors.forEach((e, i) => console.log(`${i + 1}. ${e}`));
  }

  if (pageErrors.length) {
    console.log('\n[Page Errors]');
    pageErrors.forEach((e, i) => console.log(`${i + 1}. ${e}`));
  }

  if (failedRequests.length) {
    console.log('\n[Request Failed]');
    failedRequests.forEach((r, i) => console.log(`${i + 1}. ${r.method} ${r.url} :: ${r.failure}`));
  }

  if (model404s.length) {
    console.log('\n[/images/models/* 4XX Responses]');
    model404s.forEach((r, i) => console.log(`${i + 1}. ${r.status} ${r.url}`));
  }
})();
