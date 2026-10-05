/**
 * ============================================================
 *  Tiny static preview server for dist/.
 *  Use this to check the built output exactly as Hostinger will
 *  serve it, without needing Apache.
 *
 *  Run with:  npm run serve:dist
 * ============================================================
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const PORT = process.env.PORT || 4000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

if (!fs.existsSync(DIST)) {
  console.error('dist/ does not exist. Run `npm run build` first.');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const candidates = [
    path.join(DIST, urlPath),
    path.join(DIST, urlPath, 'index.html'),
    path.join(DIST, `${urlPath}.html`),
  ];

  let file = candidates.find((c) => {
    try {
      return fs.statSync(c).isFile();
    } catch {
      return false;
    }
  });

  let status = 200;
  if (!file) {
    file = path.join(DIST, '404.html');
    status = 404;
  }

  const ext = path.extname(file);
  res.writeHead(status, {
    'Content-Type': TYPES[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000',
  });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  console.log(`\n  Static preview: http://localhost:${PORT}`);
  console.log(`  serving: ${DIST}\n`);
});
