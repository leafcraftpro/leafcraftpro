/**
 * ============================================================
 *  LeafCraftPRO — generate a specific batch of pending product
 *  images and report what is still missing.
 *
 *  Usage:
 *    node scripts/generate-pending-batch.mjs
 *
 *  Why this exists: Cloudflare Workers AI is capped at a free
 *  daily allocation of 10,000 neurons. When a batch runs out of
 *  quota mid-way (HTTP 429, code 4006) the remaining products
 *  have no photography. This script re-runs generation for just
 *  the products that are missing images, so it can be scheduled
 *  to pick up where the last run stopped.
 *
 *  It only ever generates images that do not already exist, so
 *  running it repeatedly is safe and idempotent.
 * ============================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG_DIR = path.join(ROOT, 'public', 'images', 'products');

/**
 * The batch that was blocked by the daily neuron limit. Add any
 * future blocked slugs here and re-run, or just rely on the
 * manifest comparison below.
 */
const PENDING = [
  'woven-leaf-table-centrepiece',
  'palm-leaf-outdoor-lantern',
  'woven-leaf-trivet-set',
  'woven-hanging-birdhouse',
  'coconut-leaf-hanging-fish-mobile',
  'woven-leaf-gift-bow-set',
  'leaf-woven-nativity-set',
  'woven-leaf-teapot-warmer',
  'kids-leaf-name-tag-kit',
  'woven-plant-pot-trio-set',
];

const hasImage = (slug) => fs.existsSync(path.join(IMG_DIR, `${slug}-1000.webp`));

const missing = PENDING.filter((s) => !hasImage(s));

console.log(`\n  Pending batch: ${PENDING.length} product(s)`);
console.log(`  Missing images: ${missing.length}\n`);

if (!missing.length) {
  console.log('  Nothing to do — every product in the batch already has photography.\n');
  process.exit(0);
}

let generated = 0;
let failed = 0;

for (const slug of missing) {
  process.stdout.write(`  ${slug} ... `);
  try {
    execFileSync(
      process.execPath,
      [path.join(ROOT, 'scripts', 'generate-product-images.mjs'), '--only', slug],
      { cwd: ROOT, stdio: 'pipe' }
    );
    if (hasImage(slug)) {
      generated++;
      console.log('ok');
    } else {
      failed++;
      console.log('FAILED (no image written)');
    }
  } catch (err) {
    failed++;
    const out = String(err.stdout || '') + String(err.stderr || '');
    const quota = /4006|neurons|429/.test(out);
    console.log(quota ? 'BLOCKED (daily neuron quota)' : 'FAILED');
    if (quota) {
      console.log('\n  Daily Workers AI quota is still exhausted. Stopping this run.\n');
      break;
    }
  }
}

console.log(`\n  generated: ${generated}   failed/blocked: ${failed}`);
console.log(`  remaining without images: ${missing.filter((s) => !hasImage(s)).length}\n`);

if (missing.some((s) => !hasImage(s))) process.exitCode = 1;
