import sharp from 'sharp';

await sharp('output/imagegen/em2-3.webp')
  .resize(1536, 864, { fit: 'cover', position: 'centre' })
  .png({ compressionLevel: 9 })
  .toFile('output/imagegen/em2-banner.png');

console.log('output/imagegen/em2-banner.png');
