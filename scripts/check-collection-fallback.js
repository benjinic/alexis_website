const { chromium } = require('playwright');

(async () => {
  const url = 'http://127.0.0.1:3000/collection';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const model404s = [];
  page.on('response', (res) => {
    const responseUrl = res.url();
    if (responseUrl.includes('/images/models/') && res.status() >= 400) {
      model404s.push({ url: responseUrl, status: res.status() });
    }
  });

  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);

  const result = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img[alt="Base Suit"], img[alt="Lapel"], img[alt="Pocket"]')).map((img) => ({
      alt: img.getAttribute('alt'),
      src: img.getAttribute('src'),
      currentSrc: img.currentSrc,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      isVisible: !!(img.offsetWidth || img.offsetHeight || img.getClientRects().length),
    }));

    const noPreview = !!document.body.textContent?.includes('No Preview Asset');

    return {
      found: images.length > 0 || noPreview,
      images,
      noPreview,
    };
  });

  await browser.close();

  console.log('=== Collection Fallback Verification ===');
  console.log(`URL: ${url}`);
  console.log(`MODEL_4XX_COUNT: ${model404s.length}`);
  if (model404s.length) {
    model404s.forEach((r, i) => console.log(`  ${i + 1}. ${r.status} ${r.url}`));
  }

  if (!result.found) {
    console.log('VISUALIZER_FOUND: false');
    process.exit(0);
  }

  console.log('VISUALIZER_FOUND: true');
  console.log(`NO_PREVIEW_TEXT_SHOWN: ${result.noPreview}`);
  console.log(`IMG_COUNT_IN_VISUALIZER: ${result.images.length}`);

  result.images.forEach((img, i) => {
    console.log(`\n[IMG ${i + 1}] alt=${img.alt}`);
    console.log(`  src=${img.src}`);
    console.log(`  currentSrc=${img.currentSrc}`);
    console.log(`  naturalSize=${img.naturalWidth}x${img.naturalHeight}`);
    console.log(`  visible=${img.isVisible}`);
  });

  const baseImage = result.images.find((img) => img.alt === 'Base Suit');
  const lapelImage = result.images.find((img) => img.alt === 'Lapel');
  const pocketImage = result.images.find((img) => img.alt === 'Pocket');

  const baseFallbackEffective = !!baseImage && (baseImage.currentSrc.includes('/ALEXIS%20BESPOKE.png') || baseImage.currentSrc.includes('/ALEXIS BESPOKE.png'));
  const partsHiddenAfterError = !lapelImage && !pocketImage;

  console.log('\n=== Verdict ===');
  console.log(`BASE_FALLBACK_EFFECTIVE: ${baseFallbackEffective}`);
  console.log(`PARTS_HIDDEN_AFTER_ERROR: ${partsHiddenAfterError}`);
})();
