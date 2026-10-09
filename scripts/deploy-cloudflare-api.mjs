/**
 * ============================================================
 *  LeafCraftPRO — deploy dist/ to Cloudflare Pages via the REST API.
 *
 *  Usage:
 *    node scripts/deploy-cloudflare-api.mjs [--branch main]
 *
 *  Auth (either form):
 *    CLOUDFLARE_API_KEY + CLOUDFLARE_EMAIL   (Global API Key)
 *    CLOUDFLARE_API_TOKEN                    (scoped token)
 *
 *  Why this exists alongside wrangler: wrangler bundles workerd and a
 *  full toolchain, which is brittle on Windows when its optional
 *  platform binaries are missing. The Pages direct-upload API needs
 *  nothing but fetch, and produces the same deployment.
 *
 *  Flow (mirrors what wrangler itself does):
 *    1. POST /pages/projects/<project>/upload-token   -> JWT with a file-count claim
 *    2. check which file hashes Cloudflare already holds
 *    3. POST each missing file's bytes to its upload URL
 *    4. POST /pages/projects/<project>/deployments with a multipart body
 *       where `manifest` is a JSON *string* part (not a Blob) plus `branch`
 * ============================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hash as blake3 } from 'blake3-wasm';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'd691392e25c2435bbf5f68636796446c';
const PROJECT = process.env.CF_PAGES_PROJECT || 'leafcraftpro';
const API_KEY = process.env.CLOUDFLARE_API_KEY || '';
const EMAIL = process.env.CLOUDFLARE_EMAIL || '';
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';

const branchArg = (() => {
  const i = process.argv.indexOf('--branch');
  return i !== -1 ? process.argv[i + 1] : 'main';
})();

const API = 'https://api.cloudflare.com/client/v4';

function authHeaders() {
  if (API_TOKEN) return { Authorization: `Bearer ${API_TOKEN}` };
  if (API_KEY && EMAIL) return { 'X-Auth-Key': API_KEY, 'X-Auth-Email': EMAIL };
  throw new Error('No Cloudflare credentials found.');
}

async function jsonApi(method, url, body, extraHeaders = {}) {
  const res = await fetch(url.startsWith('http') ? url : API + url, {
    method,
    headers: { ...authHeaders(), ...extraHeaders },
    body,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  if (!res.ok) throw new Error(`${method} ${url} -> HTTP ${res.status}\n${text.slice(0, 600)}`);
  return json;
}

// ---- Collect files ----------------------------------------------
/**
 * Pages asset hash. This is NOT a plain hash of the bytes:
 * wrangler hashes `base64(contents) + extension` with BLAKE3 and keeps the
 * first 32 hex characters. Using anything else uploads the bytes but leaves
 * the manifest unresolvable, and every route then returns a 500.
 */
function assetHash(buf, ext) {
  return blake3(buf.toString('base64') + ext)
    .toString('hex')
    .slice(0, 32);
}

function collect(dir, base = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...collect(p, base + '/' + e.name));
    else {
      const buf = fs.readFileSync(p);
      const ext = path.extname(e.name).substring(1).toLowerCase();
      out.push({
        name: (base + '/' + e.name).replace(/\\/g, '/'),
        hash: assetHash(buf, ext),
        size: buf.length,
        buf,
      });
    }
  }
  return out;
}

// ---- Main --------------------------------------------------------
if (!fs.existsSync(DIST)) {
  console.error('\n  dist/ not found — run `npm run build` first.\n');
  process.exit(1);
}

console.log('\n  Deploying dist/ to Cloudflare Pages');
console.log(`  project: ${PROJECT}   branch: ${branchArg}\n`);

const files = collect(DIST);
const totalBytes = files.reduce((s, f) => s + f.size, 0);
console.log(`  files : ${files.length}`);
console.log(`  size  : ${(totalBytes / 1024 / 1024).toFixed(2)} MB\n`);

// 1. upload token
const tokenRes = await jsonApi(
  'GET',
  `/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}/upload-token`
);
const jwt = tokenRes.result?.jwt || tokenRes.result;
if (!jwt || typeof jwt !== 'string') {
  throw new Error(`No upload JWT returned: ${JSON.stringify(tokenRes).slice(0, 300)}`);
}

// 2. ask which hashes are already stored
const manifestForCheck = {};
for (const f of files) manifestForCheck[f.name] = f.hash;

const checkRes = await fetch(
  `https://api.cloudflare.com/client/v4/pages/assets/check-missing`,
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ hashes: files.map((f) => f.hash) }),
  }
);
let missingHashes = null;
if (checkRes.ok) {
  const j = await checkRes.json();
  missingHashes = new Set(j.result || []);
} else {
  console.log(`  (check-missing unavailable: HTTP ${checkRes.status} — uploading all)\n`);
}

// 3. upload missing files
// The Pages asset API takes JSON (not multipart): a batch of
// { key: <sha256>, value: <base64 bytes>, metadata: { contentType }, base64: true }.
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.webmanifest': 'application/manifest+json',
};
const mimeFor = (name) => MIME[path.extname(name).toLowerCase()] || 'application/octet-stream';

const toUpload = missingHashes ? files.filter((f) => missingHashes.has(f.hash)) : files;
console.log(`  to upload : ${toUpload.length} file(s)\n`);

// Batch by count and total size, largest files first (matches wrangler's bucketing).
const MAX_BUCKET_BYTES = 35 * 1024 * 1024;
const MAX_BUCKET_FILES = 250;
const sorted = [...toUpload].sort((a, b) => b.size - a.size);
const batches = [];
let cur = { files: [], bytes: 0 };
for (const f of sorted) {
  if (cur.files.length >= MAX_BUCKET_FILES || cur.bytes + f.size > MAX_BUCKET_BYTES) {
    if (cur.files.length) batches.push(cur);
    cur = { files: [], bytes: 0 };
  }
  cur.files.push(f);
  cur.bytes += f.size;
}
if (cur.files.length) batches.push(cur);

let uploaded = 0;
for (let b = 0; b < batches.length; b++) {
  const batch = batches[b];
  const payload = batch.files.map((f) => ({
    key: f.hash,
    value: f.buf.toString('base64'),
    metadata: { contentType: mimeFor(f.name) },
    base64: true,
  }));
  const res = await fetch('https://api.cloudflare.com/client/v4/pages/assets/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`upload batch ${b + 1}/${batches.length} -> HTTP ${res.status}\n${t.slice(0, 400)}`);
  }
  uploaded += batch.files.length;
  process.stdout.write(`    uploaded ${uploaded}/${toUpload.length} files\r`);
}
if (toUpload.length) console.log(`  uploaded  : ${uploaded} file(s)\n`);

// 3b. register the hashes so the deployment can resolve them.
// Wrangler does this for every file, uploaded or already present.
const upsert = await fetch('https://api.cloudflare.com/client/v4/pages/assets/upsert-hashes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
  body: JSON.stringify({ hashes: files.map((f) => f.hash) }),
});
if (!upsert.ok) {
  const t = await upsert.text();
  throw new Error(`upsert-hashes -> HTTP ${upsert.status}\n${t.slice(0, 400)}`);
}

// 4. create the deployment (manifest is a JSON *string* part, per wrangler)
const form = new FormData();
form.append('manifest', JSON.stringify(manifestForCheck));
form.append('branch', branchArg);
form.append('commit_dirty', 'true');

const depRes = await fetch(
  `${API}/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}/deployments`,
  { method: 'POST', headers: authHeaders(), body: form }
);
const depText = await depRes.text();
if (!depRes.ok) {
  throw new Error(`create deployment -> HTTP ${depRes.status}\n${depText.slice(0, 600)}`);
}
const depJson = JSON.parse(depText);
const dep = depJson.result;

console.log(`  deployment: ${dep.id}`);
console.log(`  stage     : ${dep.latest_stage?.name || 'deploy'}`);
console.log(`  status    : ${dep.latest_stage?.status || 'success'}`);
console.log(`  url       : ${dep.url || `https://${PROJECT}.pages.dev`}`);
if (dep.aliases) dep.aliases.forEach((a) => console.log(`  alias     : ${a}`));
console.log('\n  Done.\n');
