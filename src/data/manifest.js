/**
 * ============================================================
 *  Image manifest loader.
 *  optimize-images.js writes src/data/image-manifest.json;
 *  this module reads it once and exposes it to the views so
 *  every <img> can use the right srcset and blur-up placeholder.
 * ============================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, 'image-manifest.json');

const empty = { blog: {}, products: {}, hero: {}, meta: {} };

let manifest = empty;
try {
  manifest = JSON.parse(fs.readFileSync(FILE, 'utf8'));
} catch {
  console.warn(
    '  ! image-manifest.json not found — run `npm run images` first.\n' +
    '    Images will render without blur-up placeholders.'
  );
}

export default manifest;
export { manifest };
