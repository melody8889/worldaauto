import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const htmlPath = path.join(root, 'tools', 'uae-export-planning-video.html');
const outDir = path.join(root, 'assets', 'videos');
const outFile = path.join(outDir, 'uae-export-planning.webm');

fs.mkdirSync(outDir, { recursive: true });
if (fs.existsSync(outFile)) fs.unlinkSync(outFile);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
});

await page.goto(`file://${htmlPath.replaceAll('\\', '/')}`);
await page.waitForLoadState('networkidle');

await page.evaluate(async () => {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      displaySurface: 'browser',
      width: 1280,
      height: 720,
      frameRate: 30,
    },
    audio: false,
    preferCurrentTab: true,
  });
  window.__chunks = [];
  window.__recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
  window.__recorder.ondataavailable = event => {
    if (event.data && event.data.size) window.__chunks.push(event.data);
  };
  window.__done = new Promise(resolve => {
    window.__recorder.onstop = async () => {
      const blob = new Blob(window.__chunks, { type: 'video/webm' });
      const buffer = await blob.arrayBuffer();
      resolve(Array.from(new Uint8Array(buffer)));
    };
  });
  window.__recorder.start();
});

await page.waitForTimeout(15200);
const bytes = await page.evaluate(async () => {
  window.__recorder.stop();
  return await window.__done;
});

fs.writeFileSync(outFile, Buffer.from(bytes));
await browser.close();

console.log(outFile);
