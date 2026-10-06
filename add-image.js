/**
 * ============================================================
 *  Add a source photograph to the site's image library.
 *
 *  Usage:
 *    node add-image.js <source-image> <slug> [--group blog|products|hero]
 *
 *  Example:
 *    node add-image.js ~/Pictures/coil-basket.jpg how-to-make-a-coil-basket
 *
 *  What it produces, matching the existing library exactly:
 *
 *    public/images/blog/<slug>-400.webp     (and 640 / 960 / 1280)
 *    public/images/og/<slug>-og.webp        1200x630 social card
 *    src/data/image-manifest.json           lqip + widths entry
 *
 *  The manifest entry is what the <img> helpers read to build srcset
 *  and the blur-up placeholder, so an image that is not in the
 *  manifest renders without them.
 *
 *  Widths larger than the source are skipped rather than upscaled —
 *  the manifest records only the widths that were actually written,
 *  so srcset never advertises a file that does not exist.
 *
 *  Requires `sharp`. It is intentionally NOT a runtime dependency of
 *  the site: nothing in src/ or server.js imports it. Install it on
 *  demand with `npm install --no-save sharp`.
 * ============================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST = path.join(ROOT, 'src', 'data', 'image-manifest.json');

const WIDTHS = [400, 640, 960, 1280];
const WEBP_QUALITY = 82;
const LQIP_WIDTH = 20;
const LQIP_QUALITY = 30;
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const GROUPS = {
  blog: { dir: 'blog', og: true },
  products: { dir: 'products', og: true },
  authors: { dir: 'authors', og: false },
  hero: { dir: 'hero', og: false },
};

function usage(msg) {
  if (msg) console.error(`\n  ${msg}`);
  console.log(`
  Usage:  node add-image.js <source-image> <slug> [--group blog|products|hero]

  Example:
    node add-image.js ~/Pictures/basket.jpg how-to-make-a-coil-basket
    node add-image.js ./shot.png woven-fruit-bowl --group products
`);
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length < 2) usage();

const src = path.resolve(args[0]);
let slug = args[1];
let group = 'blog';

const gi = args.indexOf('--group');
if (gi !== -1) {
  group = args[gi + 1];
  if (!GROUPS[group]) usage(`unknown group "${group}"`);
}

slug = slug.replace(/\.[a-z0-9]+$/i, '').replace(/[^a-z0-9-]+/gi, '-').toLowerCase();

if (!fs.existsSync(src)) usage(`source image not found: ${src}`);
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) usage(`slug must be kebab-case: "${slug}"`);

let sharp;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  console.error(
    '\n  sharp is not installed. It is deliberately not a runtime dependency.\n' +
      '  Install it for this one command:\n\n' +
      '      npm install --no-save sharp\n'
  );
  process.exit(1);
}

const { dir, og: wantsOg } = GROUPS[group];
const outDir = path.join(ROOT, 'public', 'images', dir);
const ogDir = path.join(ROOT, 'public', 'images', 'og');
fs.mkdirSync(outDir, { recursive: true });

const meta = await sharp(src).metadata();
console.log(`\n  source : ${meta.width}x${meta.height} ${meta.format}`);
console.log(`  slug   : ${slug}`);
console.log(`  group  : ${group}\n`);

// ---- Responsive widths ------------------------------------------
const written = [];
for (const w of WIDTHS) {
  if (w > meta.width) continue;
  const out = path.join(outDir, `${slug}-${w}.webp`);
  await sharp(src).resize({ width: w }).webp({ quality: WEBP_QUALITY }).toFile(out);
  written.push(w);
  console.log(`  wrote  : ${path.relative(ROOT, out)}`);
}

if (!written.length) {
  console.error(`\n  Source is only ${meta.width}px wide — narrower than every target width.`);
  process.exit(1);
}

// ---- Blur-up placeholder ----------------------------------------
const lqipBuf = await sharp(src)
  .resize({ width: LQIP_WIDTH })
  .webp({ quality: LQIP_QUALITY })
  .toBuffer();
const lqip = `data:image/webp;base64,${lqipBuf.toString('base64')}`;
console.log(`  wrote  : LQIP ${lqipBuf.length} bytes (${LQIP_WIDTH}px)`);

// ---- Social card -------------------------------------------------
if (wantsOg) {
  fs.mkdirSync(ogDir, { recursive: true });
  const ogPath = path.join(ogDir, `${slug}-og.webp`);
  await sharp(src)
    .resize({ width: OG_WIDTH, height: OG_HEIGHT, fit: 'cover', position: 'centre' })
    .webp({ quality: WEBP_QUALITY })
    .toFile(ogPath);
  console.log(`  wrote  : ${path.relative(ROOT, ogPath)} (${OG_WIDTH}x${OG_HEIGHT})`);
}

// ---- Manifest entry ----------------------------------------------
const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
if (!manifest[group]) manifest[group] = {};

const existed = Boolean(manifest[group][slug]);
manifest[group][slug] = {
  lqip,
  width: meta.width,
  height: meta.height,
  widths: written,
  src: written[written.length - 1],
};

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(
  `  manifest: ${existed ? 'updated' : 'added'} ${group}.${slug} ` +
    `(widths ${written.join(', ')}, src ${written[written.length - 1]})`
);

console.log(`
  Done. Reference it in a post with:

      image: '${slug}',
      imageAlt: '<describe the photo>',

  or inline:

      { type: 'image', src: '${slug}', alt: '...', caption: '...' }

  Then rebuild:  npm run build
`);
