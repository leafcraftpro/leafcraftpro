/**
 * ============================================================
 *  Image pipeline — LeafCraftPRO
 *  Reads the raw generated PNGs, then produces responsive,
 *  compressed WebP derivatives plus low-quality image
 *  placeholders (LQIP) and 1200x630 social share images.
 *
 *  Run with:  npm run images
 * ============================================================
 */

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const RAW = path.join(ROOT, '.raw-images', 'raw');
const OUT = path.join(ROOT, 'public', 'images');

// ---- Responsive widths ----------------------------------------
// Blog / hero images are landscape 3:2, product shots are square.
const WIDTHS = {
  hero: [640, 960, 1280, 1600],
  blog: [400, 640, 960, 1280],
  product: [320, 480, 720, 1000],
};

const OG = { width: 1200, height: 630 };
const LQIP_WIDTH = 20;

const log = (...a) => console.log('  ', ...a);

/** Pad a number to two digits. */
const pad = (n) => String(n).padStart(2, '0');

/** Find a raw file by its code prefix (LCB01, LCP07, LCXHERO, B01 ...). */
function findRaw(prefix) {
  if (!fs.existsSync(RAW)) return null;
  const files = fs.readdirSync(RAW);
  const match = files.find(
    (f) => f.toLowerCase().startsWith(prefix.toLowerCase() + '.') ||
           f.toLowerCase().startsWith(prefix.toLowerCase() + '__')
  );
  return match ? path.join(RAW, match) : null;
}

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

/**
 * Produce every derivative for one source image.
 * @returns {Promise<{lqip: string, width: number, height: number}>}
 */
async function processImage({ raw, outDir, baseName, widths, aspect, quality = 78 }) {
  await ensureDir(outDir);

  let pipeline = sharp(raw).rotate();
  const meta = await pipeline.metadata();

  // Crop to the target aspect ratio, centred, so every card lines up.
  if (aspect) {
    const target = aspect;
    const current = meta.width / meta.height;
    let cw = meta.width;
    let ch = meta.height;
    if (current > target) {
      cw = Math.round(meta.height * target);
    } else {
      ch = Math.round(meta.width / target);
    }
    pipeline = sharp(raw)
      .rotate()
      .resize(cw, ch, { fit: 'cover', position: 'attention' });
  }

  // Re-read the cropped buffer once so all widths come from the same crop.
  const base = await pipeline.png().toBuffer();
  const baseMeta = await sharp(base).metadata();

  const written = [];

  for (const w of widths) {
    if (w > baseMeta.width) continue;
    await sharp(base)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality, effort: 5 })
      .toFile(path.join(outDir, `${baseName}-${w}.webp`));
    written.push(w);
  }

  // Always guarantee the smallest width exists, even for small sources.
  const smallest = widths[0];
  if (!written.length) {
    await sharp(base).resize({ width: smallest }).webp({ quality, effort: 5 })
      .toFile(path.join(outDir, `${baseName}-${smallest}.webp`));
    written.push(smallest);
  }

  // Low quality image placeholder for blur-up loading.
  const lqipBuf = await sharp(base)
    .resize({ width: LQIP_WIDTH })
    .webp({ quality: 28 })
    .toBuffer();
  const lqip = `data:image/webp;base64,${lqipBuf.toString('base64')}`;

  return {
    lqip,
    width: baseMeta.width,
    height: baseMeta.height,
    widths: written,
    // The largest width that actually exists, used for the <img src>.
    src: written[written.length - 1],
  };
}

/** Build a 1200x630 social share card. */
async function processOg({ raw, outDir, baseName, aspect }) {
  await ensureDir(outDir);
  let pipeline = sharp(raw).rotate();
  if (aspect) {
    const meta = await pipeline.metadata();
    const current = meta.width / meta.height;
    let cw = meta.width;
    let ch = meta.height;
    if (current > aspect) cw = Math.round(meta.height * aspect);
    else ch = Math.round(meta.width / aspect);
    pipeline = sharp(raw).rotate().resize(cw, ch, { fit: 'cover', position: 'attention' });
  }
  await pipeline
    .resize(OG.width, OG.height, { fit: 'cover', position: 'centre' })
    .webp({ quality: 76, effort: 5 })
    .toFile(path.join(outDir, `${baseName}-og.webp`));
}

async function main() {
  console.log('\nLeafCraftPRO — image pipeline\n');

  if (!fs.existsSync(RAW)) {
    console.error(`Raw image folder not found: ${RAW}`);
    process.exit(1);
  }

  // ---- Load content so we know each image's slug ---------------
  const { default: posts } = await import('../src/data/posts/index.js');
  const { default: products } = await import('../src/data/products.js');

  const manifest = { blog: {}, products: {}, hero: {}, meta: {} };
  let processed = 0;
  let skipped = 0;

  // ---- Blog + hero images -------------------------------------
  const blogDir = path.join(OUT, 'blog');
  const heroDir = path.join(OUT, 'hero');
  const ogDir = path.join(OUT, 'og');

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const raw = findRaw(`LCB${pad(i + 1)}`) || findRaw(`B${pad(i + 1)}`);
    if (!raw) {
      log(`skip  ${post.slug} (no raw file for LCB${pad(i + 1)})`);
      skipped++;
      continue;
    }
    const r = await processImage({
      raw,
      outDir: blogDir,
      baseName: post.slug,
      widths: WIDTHS.blog,
      aspect: 3 / 2,
      quality: 78,
    });
    await processOg({ raw, outDir: ogDir, baseName: post.slug, aspect: 3 / 2 });
    manifest.blog[post.slug] = r;
    processed++;
  }

  const heroRaw = findRaw('LCXHERO');
  if (heroRaw) {
    manifest.hero.main = await processImage({
      raw: heroRaw,
      outDir: heroDir,
      baseName: 'main',
      widths: WIDTHS.hero,
      aspect: 16 / 9,
      quality: 80,
    });
    await processOg({ raw: heroRaw, outDir: ogDir, baseName: 'site-default', aspect: 16 / 9 });
    processed++;
  }

  // ---- Product images -----------------------------------------
  const prodDir = path.join(OUT, 'products');
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const raw = findRaw(`LCP${pad(i + 1)}`);
    if (!raw) {
      log(`skip  ${product.slug} (no raw file for LCP${pad(i + 1)})`);
      skipped++;
      continue;
    }
    const r = await processImage({
      raw,
      outDir: prodDir,
      baseName: product.slug,
      widths: WIDTHS.product,
      aspect: 1,
      quality: 80,
    });
    await processOg({ raw, outDir: ogDir, baseName: product.slug, aspect: 1 });
    manifest.products[product.slug] = r;
    processed++;
  }

  // ---- Write the manifest -------------------------------------
  manifest.meta = {
    generatedAt: new Date().toISOString(),
    blogWidths: WIDTHS.blog,
    productWidths: WIDTHS.product,
    heroWidths: WIDTHS.hero,
  };

  await ensureDir(path.join(ROOT, 'src', 'data'));
  await fsp.writeFile(
    path.join(ROOT, 'src', 'data', 'image-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  // ---- Report -------------------------------------------------
  const dirSize = (dir) => {
    if (!fs.existsSync(dir)) return 0;
    let total = 0;
    const walk = (d) => {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        const full = path.join(d, entry.name);
        if (entry.isDirectory()) walk(full);
        else total += fs.statSync(full).size;
      }
    };
    walk(dir);
    return total;
  };

  console.log('\n  --------------------------------');
  log(`images processed : ${processed}`);
  log(`images skipped   : ${skipped}`);
  log(`total output size: ${(dirSize(OUT) / 1024 / 1024).toFixed(2)} MB`);
  log(`manifest         : src/data/image-manifest.json`);
  console.log('  --------------------------------\n');
}

main().catch((err) => {
  console.error('\nImage pipeline failed:', err);
  process.exit(1);
});
