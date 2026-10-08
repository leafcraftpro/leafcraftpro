/**
 * Regenerate the site's brand assets from the two source files in `brand logo/`.
 *
 *   node scripts/brand-assets.mjs
 *
 * Produces, in public/assets/img/:
 *   logo.webp, logo-500.webp              full colour, for the cream header
 *   logo-light.webp, logo-light-500.webp  white, for the dark green footer
 *   icon-16/32/48/180/192/512.png         favicon, apple-touch-icon, PWA icons
 *
 * The sources are expected to be WebP with a transparent background. The logo
 * is a full wordmark at 1000x263, so it replaces both the old SVG mark and the
 * separate text lockup — there is nothing to keep in sync by hand.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT, 'brand logo');
const OUT_DIR = path.join(ROOT, 'public', 'assets', 'img');

const LOGO_SRC = path.join(SRC_DIR, 'Leaf Craft PRO Eco Woven Logo.webp');
const ICON_SRC = path.join(SRC_DIR, 'Leaf Craft PRO Eco Woven Favicon.webp');

const WEBP_QUALITY = 90;
const ICON_SIZES = [16, 32, 48, 180, 192, 512];

function require(file) {
  if (!fs.existsSync(file)) {
    console.error(`\n  Missing source: ${path.relative(ROOT, file)}`);
    console.error('  Put the logo and favicon WebP files in the "brand logo" folder.\n');
    process.exit(1);
  }
}

require(LOGO_SRC);
require(ICON_SRC);
fs.mkdirSync(OUT_DIR, { recursive: true });

// ---- Logo, full colour -------------------------------------------------
const logoMeta = await sharp(LOGO_SRC).metadata();
await sharp(LOGO_SRC).webp({ quality: WEBP_QUALITY }).toFile(path.join(OUT_DIR, 'logo.webp'));
await sharp(LOGO_SRC)
  .resize({ width: 500 })
  .webp({ quality: WEBP_QUALITY })
  .toFile(path.join(OUT_DIR, 'logo-500.webp'));
console.log(`  logo.webp              ${logoMeta.width}x${logoMeta.height}`);
console.log('  logo-500.webp          500px wide');

// ---- Logo, white (for the dark footer) ---------------------------------
// Keep the source alpha and replace every colour channel with white. A CSS
// filter would also invert the antialiased edges and leave a halo on dark
// backgrounds; this keeps the edges clean because the alpha is untouched.
const { data, info } = await sharp(LOGO_SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
  data[i] = 255;
  data[i + 1] = 255;
  data[i + 2] = 255;
}
const raw = { raw: { width: info.width, height: info.height, channels: 4 } };
await sharp(data, raw).webp({ quality: WEBP_QUALITY }).toFile(path.join(OUT_DIR, 'logo-light.webp'));
await sharp(data, raw)
  .resize({ width: 500 })
  .webp({ quality: WEBP_QUALITY })
  .toFile(path.join(OUT_DIR, 'logo-light-500.webp'));
console.log('  logo-light.webp        white variant, same size');
console.log('  logo-light-500.webp    500px wide');

// ---- Favicon set -------------------------------------------------------
// The source is near-square but not exactly, so pad to a true square first.
// Browsers and iOS both squash a non-square icon given a square slot.
const square = await sharp(ICON_SRC)
  .resize({ width: 512, height: 512, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

for (const size of ICON_SIZES) {
  await sharp(square)
    .resize({ width: size, height: size })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_DIR, `icon-${size}.png`));
  console.log(`  icon-${size}.png`.padEnd(24) + `${size}x${size}`);
}

console.log('\n  Done. Run `npm run build` to pick these up.\n');
