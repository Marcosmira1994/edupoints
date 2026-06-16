const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('https://marcosmira1994.github.io/edupoints/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: 'shot_ranking.png' });
  await page.click('button[data-v="cfg"]');
  await page.waitForTimeout(1200);
  await page.evaluate(() => { var el = document.getElementById('meta-cfg'); if(el) el.scrollIntoView({behavior:'instant'}); });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'shot_config.png' });
  await browser.close();
  process.stdout.write('screenshots salvos\n');
})().catch(e => { process.stderr.write(e.message+'\n'); process.exit(1); });
