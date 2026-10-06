/**
 * ============================================================
 *  LeafCraftPRO — deployment preflight check.
 *
 *  Run this ON THE SERVER, in the application root:
 *
 *      node preflight.js
 *
 *  It answers one question: "is this folder able to run the app?"
 *  Every check prints PASS or FAIL with the exact fix, so a 503
 *  can be diagnosed without guessing or reading logs.
 *
 *  It changes nothing. It only reads and reports.
 * ============================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const results = [];
let failures = 0;

function check(name, ok, detail, fix) {
  results.push({ name, ok, detail, fix });
  if (!ok) failures++;
}

function line(label, value) {
  return `  ${label.padEnd(22)}${value}`;
}

console.log('');
console.log('  LeafCraftPRO — deployment preflight');
console.log('  ' + '='.repeat(52));
console.log(line('checked at', new Date().toISOString()));
console.log(line('node version', process.version));
console.log(line('working dir', process.cwd()));
console.log(line('script dir', __dirname));
console.log('');

// ---------------------------------------------------------------
// 1. Are we in the application root?
// ---------------------------------------------------------------

const pkgPath = path.join(__dirname, 'package.json');
const hasPkg = fs.existsSync(pkgPath);

let pkg = null;
if (hasPkg) {
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } catch (err) {
    check('package.json parses', false, err.message, 'Re-upload package.json; it is corrupt.');
  }
}

check(
  'package.json here',
  hasPkg,
  hasPkg ? 'found' : 'NOT FOUND',
  'This folder is not the application root. The application root must be the ' +
    'folder that directly contains package.json and server.js — not its public/ ' +
    'subfolder. In hPanel -> Node.js, set the application root to the folder ' +
    'holding package.json, then upload the whole project there.'
);

check(
  'server.js here',
  fs.existsSync(path.join(__dirname, 'server.js')),
  fs.existsSync(path.join(__dirname, 'server.js')) ? 'found' : 'NOT FOUND',
  'Upload server.js to this folder.'
);

check(
  'src/ here',
  fs.existsSync(path.join(__dirname, 'src')),
  fs.existsSync(path.join(__dirname, 'src')) ? 'found' : 'NOT FOUND',
  'Upload the src/ folder to this folder. It holds every route and template.'
);

check(
  'public/ here',
  fs.existsSync(path.join(__dirname, 'public')),
  fs.existsSync(path.join(__dirname, 'public')) ? 'found' : 'NOT FOUND',
  'Upload the public/ folder. It holds the CSS, JS and images.'
);

// A very common failure: only public/'s contents were uploaded, so the
// docroot has assets/ and images/ but no package.json. Detect that shape
// explicitly, because the symptom (static 200 / pages 503) looks like a
// code problem when it is a wrong-folder problem.
const looksLikePublicOnly =
  !hasPkg &&
  fs.existsSync(path.join(__dirname, 'assets')) &&
  fs.existsSync(path.join(__dirname, 'images'));

if (looksLikePublicOnly) {
  console.log('  ' + '-'.repeat(52));
  console.log('  DIAGNOSIS: this folder contains the CONTENTS of public/');
  console.log('  (assets/ + images/) but no package.json or server.js.');
  console.log('  Passenger therefore has no application to start, and every');
  console.log('  URL that is not a real file returns 503 — while the CSS and');
  console.log('  images keep working. That is exactly this folder.');
  console.log('');
  console.log('  Fix: upload the WHOLE PROJECT here — package.json,');
  console.log('  package-lock.json, server.js, app.js, src/ and public/ —');
  console.log('  then run:  npm install --omit=dev');
  console.log('  ' + '-'.repeat(52));
  console.log('');
}

// ---------------------------------------------------------------
// 2. Dependencies
// ---------------------------------------------------------------

const nodeModules = path.join(__dirname, 'node_modules');
const hasModules = fs.existsSync(nodeModules);

check(
  'node_modules here',
  hasModules,
  hasModules ? 'found' : 'NOT FOUND',
  'Run: npm install --omit=dev   (in this folder, with the Node virtualenv ' +
    'activated). Never upload node_modules from your own computer — it ' +
    'contains platform-specific binaries that will not run on Linux.'
);

const required = Object.keys((pkg && pkg.dependencies) || {});
const missing = [];
for (const dep of required) {
  if (!fs.existsSync(path.join(nodeModules, dep))) missing.push(dep);
}

check(
  'dependencies present',
  required.length > 0 && missing.length === 0,
  missing.length === 0
    ? `${required.length} of ${required.length} resolvable`
    : `missing: ${missing.join(', ')}`,
  'Run: npm install --omit=dev   (in this folder)'
);

// ---------------------------------------------------------------
// 3. Can the app actually load?
// ---------------------------------------------------------------

let appOk = false;
let routeCount = 0;
let renderOk = false;
let renderError = '';

if (hasPkg && hasModules && missing.length === 0) {
  try {
    const { buildRoutes } = await import('./src/routes.js');
    routeCount = buildRoutes().length;
    appOk = routeCount > 0;
  } catch (err) {
    renderError = err.message;
  }

  check(
    'app source loads',
    appOk,
    appOk ? `${routeCount} routes built` : `failed: ${renderError}`,
    'A module failed to import. Check the log line above for the missing file ' +
      'or syntax error, and re-upload the src/ folder.'
  );

  if (appOk) {
    try {
      const { render } = await import('./src/lib/render.js');
      const routes = (await import('./src/routes.js')).buildRoutes();
      const home = routes.find((r) => r.url === '') || routes[0];
      const html = await render(home.view, {
        ...home.data,
        manifest: (await import('./src/data/manifest.js')).default,
        page: home.page,
        current: home.current || '',
        bodyClass: home.bodyClass || '',
      });
      renderOk = typeof html === 'string' && html.length > 500;
    } catch (err) {
      renderError = err.message;
    }

    check(
      'a page renders',
      renderOk,
      renderOk ? 'home page rendered' : `failed: ${renderError}`,
      'Templates failed to render. Confirm the src/views folder uploaded ' +
        'completely, including src/views/layouts/ and src/views/partials/.'
    );
  }
} else {
  console.log('  (skipping app-load checks until the above are fixed)');
  console.log('');
}

// ---------------------------------------------------------------
// 4. Port handling — what Passenger will hand us
// ---------------------------------------------------------------

const RAW_PORT = process.env.PORT;
const IS_SOCKET = typeof RAW_PORT === 'string' && /[\\/]/.test(RAW_PORT);

check(
  'PORT is usable',
  true,
  RAW_PORT ? (IS_SOCKET ? `unix socket ${RAW_PORT}` : `tcp ${RAW_PORT}`) : 'unset — will bind 3000',
  ''
);

if (process.env.HOST) {
  check(
    'HOST not hard-coded',
    false,
    `HOST=${process.env.HOST}`,
    'Remove HOST from the Node.js environment variables in hPanel. Passenger ' +
      'assigns the address; overriding it breaks the binding.'
  );
} else {
  check('HOST not hard-coded', true, 'unset (correct)', '');
}

// ---------------------------------------------------------------
// Report
// ---------------------------------------------------------------

console.log('');
console.log('  ' + '='.repeat(52));
for (const r of results) {
  console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.name.padEnd(22)}${r.detail}`);
  if (!r.ok && r.fix) {
    console.log(`        -> ${r.fix.replace(/(.{66})\s/g, '$1\n           ')}`);
  }
}
console.log('  ' + '='.repeat(52));

if (failures === 0) {
  console.log('');
  console.log('  All checks passed. This folder can run the app.');
  console.log('  Next: in hPanel -> Node.js, click Restart, then open');
  console.log('        https://<your-domain>/healthz');
  console.log('  You should get JSON back. If you get a 503 instead, the');
  console.log('  panel is still pointing at a different folder — compare the');
  console.log('  "script dir" printed above with the Application root in hPanel.');
  console.log('');
} else {
  console.log('');
  console.log(`  ${failures} check(s) failed. Fix the items marked FAIL above.`);
  console.log('  Every URL except real files returns 503 until these pass.');
  console.log('');
  process.exitCode = 1;
}
