import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const input = 'output/imagegen/sany-4.png';
const outDir = 'output/imagegen';
const outFile = `${outDir}/sany-electric-trucks-banner-v4.png`;

await mkdir(outDir, { recursive: true });

const bg = await sharp(input)
  .resize(1536, 864, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 0.28, saturation: 0.72 })
  .blur(24)
  .png()
  .toBuffer();

const fg = await sharp(input)
  .extract({ left: 0, top: 120, width: 736, height: 660 })
  .resize(1040, 820, { fit: 'cover', position: 'centre' })
  .png()
  .toBuffer();

const overlay = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1536" height="864" viewBox="0 0 1536 864" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="leftFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#020406" stop-opacity="0.9"/>
      <stop offset="62%" stop-color="#020406" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="#020406" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#020406" stop-opacity="0"/>
      <stop offset="100%" stop-color="#020406" stop-opacity="0.55"/>
    </linearGradient>
  </defs>
  <rect width="1536" height="864" fill="url(#leftFade)"/>
  <rect width="1536" height="864" fill="url(#bottomFade)"/>
</svg>`);

await sharp(bg)
  .composite([
    { input: fg, left: 520, top: 18 },
    { input: overlay, left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(outFile);

console.log(outFile);
