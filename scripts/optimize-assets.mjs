import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assets = path.join(root, 'assets');
const version = '20260925';
const output = name => path.join(assets, `${name}-${version}.webp`);

await mkdir(assets, { recursive: true });

const conversions = [
  ['lace-envelope-v2.png', 'lace-envelope', { width: 760, height: 760, fit: 'inside' }, 84],
  ['seal-lg.png', 'seal', { width: 280, height: 280, fit: 'inside' }, 86],
  ['couple-comic.png', 'couple-comic', { width: 480, height: 320, fit: 'inside' }, 84],
  ['lace-ornament-bg-v2.png', 'lace-ornament-bg', { width: 900, height: 1200, fit: 'inside' }, 82],
  ['oval-lace-v2.png', 'oval-lace', { width: 640, height: 960, fit: 'inside' }, 84],
  ['fountain-birds.png', 'fountain-birds', { width: 384, height: 384, fit: 'inside' }, 84],
  ['envelope-photo.jpg', 'envelope-photo', { width: 480, height: 720, fit: 'inside' }, 84],
];

for (const [source, target, resize, quality] of conversions) {
  await sharp(path.join(assets, source))
    .rotate()
    .resize(resize)
    .webp({ quality, alphaQuality: 92, effort: 6, smartSubsample: true })
    .toFile(output(target));
}

for (let index = 1; index <= 20; index += 1) {
  const number = String(index).padStart(2, '0');
  await sharp(path.join(assets, `gallery-${number}.jpg`))
    .rotate()
    .resize({ width: 720, height: 1080, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 6, smartSubsample: true })
    .toFile(output(`gallery-${number}`));
}

const shareWidth = 1200;
const shareHeight = 630;
const sharePhotoWidth = 510;
const sharePhoto = await sharp(path.join(assets, 'gallery-01.jpg'))
  .rotate()
  .resize({ width: sharePhotoWidth, height: shareHeight, fit: 'cover', position: 'attention' })
  .modulate({ saturation: 0.9 })
  .toBuffer();

const shareBackground = await sharp(path.join(assets, 'lace-ornament-bg-v2.png'))
  .resize({ width: shareWidth, height: shareHeight, fit: 'cover' })
  .blur(1.2)
  .modulate({ brightness: 0.46, saturation: 0.65 })
  .toBuffer();

const textLayer = Buffer.from(`
  <svg width="${shareWidth}" height="${shareHeight}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="photoShade" x1="0" x2="1">
        <stop offset="0" stop-color="#291f20" stop-opacity=".95"/>
        <stop offset=".34" stop-color="#291f20" stop-opacity=".55"/>
        <stop offset="1" stop-color="#291f20" stop-opacity=".06"/>
      </linearGradient>
    </defs>
    <rect width="${shareWidth}" height="${shareHeight}" fill="none" stroke="#fff8ed" stroke-opacity=".4" stroke-width="3"/>
    <rect x="${shareWidth - sharePhotoWidth - 125}" width="${sharePhotoWidth + 125}" height="${shareHeight}" fill="url(#photoShade)"/>
    <g fill="#fff8ed">
      <text x="88" y="142" font-family="Georgia, serif" font-size="30" letter-spacing="7">WEDDING INVITATION</text>
      <text x="86" y="275" font-family="Songti SC, STSong, serif" font-size="69" letter-spacing="5">李晨鸣</text>
      <text x="92" y="342" font-family="Georgia, serif" font-size="35" font-style="italic">&amp;</text>
      <text x="142" y="342" font-family="Songti SC, STSong, serif" font-size="69" letter-spacing="5">高雅婷</text>
      <line x1="88" y1="390" x2="550" y2="390" stroke="#d8c49d" stroke-width="2"/>
      <text x="88" y="456" font-family="Georgia, serif" font-size="39" letter-spacing="5">2026.11.20</text>
      <text x="88" y="516" font-family="PingFang SC, sans-serif" font-size="25" letter-spacing="3" fill="#d9cfc5">台州 · In The Ark 在方舟礼堂</text>
    </g>
  </svg>
`);

await sharp(shareBackground)
  .composite([
    { input: sharePhoto, left: shareWidth - sharePhotoWidth, top: 0 },
    { input: textLayer, left: 0, top: 0 },
  ])
  .jpeg({ quality: 88, progressive: true, mozjpeg: true })
  .toFile(path.join(assets, `share-preview-${version}.jpg`));

const squarePhoto = await sharp(path.join(assets, 'gallery-01.jpg'))
  .rotate()
  .resize({ width: 600, height: 600, fit: 'cover', position: 'attention' })
  .modulate({ saturation: 0.9 })
  .toBuffer();

const squareTextLayer = Buffer.from(`
  <svg width="600" height="600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
        <stop offset=".35" stop-color="#291f20" stop-opacity=".02"/>
        <stop offset="1" stop-color="#291f20" stop-opacity=".94"/>
      </linearGradient>
    </defs>
    <rect width="600" height="600" fill="url(#shade)"/>
    <rect x="14" y="14" width="572" height="572" fill="none" stroke="#fff8ed" stroke-opacity=".7" stroke-width="2"/>
    <g fill="#fff8ed" text-anchor="middle">
      <text x="300" y="474" font-family="Songti SC, STSong, serif" font-size="50" letter-spacing="5">李晨鸣 &amp; 高雅婷</text>
      <text x="300" y="533" font-family="Georgia, serif" font-size="27" letter-spacing="5">2026.11.20</text>
      <text x="300" y="565" font-family="PingFang SC, sans-serif" font-size="17" letter-spacing="3">WEDDING INVITATION</text>
    </g>
  </svg>
`);

await sharp(squarePhoto)
  .composite([{ input: squareTextLayer, left: 0, top: 0 }])
  .jpeg({ quality: 87, progressive: true, mozjpeg: true })
  .toFile(path.join(assets, `share-thumbnail-${version}.jpg`));

await sharp(path.join(assets, 'seal-lg.png'))
  .resize({ width: 96, height: 96, fit: 'inside' })
  .png({ compressionLevel: 9, palette: true })
  .toFile(path.join(assets, `favicon-${version}.png`));
