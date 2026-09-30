import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const input = 'output/imagegen/sany-4.png';
const outDir = 'output/imagegen';
const outFile = `${outDir}/sany-electric-trucks-banner.png`;

await mkdir(outDir, { recursive: true });

const bg = await sharp(input)
  .resize(1536, 864, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 0.34, saturation: 0.7 })
  .blur(26)
  .png()
  .toBuffer();

const fg = await sharp(input)
  .resize({ height: 800, fit: 'contain' })
  .png()
  .toBuffer();

const overlay = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1536" height="864" viewBox="0 0 1536 864" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="leftFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#05070a" stop-opacity="0.82"/>
      <stop offset="55%" stop-color="#05070a" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#05070a" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#05070a" stop-opacity="0"/>
      <stop offset="100%" stop-color="#05070a" stop-opacity="0.42"/>
    </linearGradient>
  </defs>
  <rect width="1536" height="864" fill="url(#leftFade)"/>
  <rect width="1536" height="864" fill="url(#bottomFade)"/>
</svg>`);

await sharp(bg)
  .composite([
    { input: fg, left: 760, top: 26 },
    { input: overlay, left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(outFile);

console.log(outFile);
