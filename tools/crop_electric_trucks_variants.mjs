import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const input = 'output/imagegen/electric-trucks-pexels.jpg';
const outDir = 'output/imagegen';
await mkdir(outDir, { recursive: true });

const variants = [
  { name: 'electric-trucks-crop-a.jpg', left: 7300, top: 4400, width: 8200, height: 4600 },
  { name: 'electric-trucks-crop-b.jpg', left: 6100, top: 3950, width: 9000, height: 5063 },
  { name: 'electric-trucks-crop-c.jpg', left: 5200, top: 4550, width: 9800, height: 5512 },
];

for (const v of variants) {
  await sharp(input)
    .extract({ left: v.left, top: v.top, width: v.width, height: v.height })
    .resize(1536, 864, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(`${outDir}/${v.name}`);
  console.log(v.name);
}
