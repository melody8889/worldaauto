import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const html = 'file:///' + path.join(dir, 'zeekr-8x-sales.html').replace(/\\/g, '/');

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(html, { waitUntil: 'networkidle' });
await page.locator('#wide').screenshot({ path: path.join(dir, 'zeekr-8x-sales-wide-1920x1080.png') });

await page.setViewportSize({ width: 1080, height: 1350 });
await page.locator('#vertical').screenshot({ path: path.join(dir, 'zeekr-8x-sales-vertical-1080x1350.png') });

await browser.close();
