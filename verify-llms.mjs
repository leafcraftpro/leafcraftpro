// Verify the built dist/ tree: llms.txt links, markdown twins, fonts, preloads.
import fs from 'node:fs';
import path from 'node:path';

const DIST = process.argv[2] || 'dist';

const servable = new Set();
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) { walk(f); continue; }
    const rel = path.relative(DIST, f).split(path.sep).join('/');
    if (rel === 'index.html') { servable.add('/'); continue; }
    if (rel.endsWith('.html')) { servable.add('/' + rel.slice(0, -5)); continue; }
    servable.add('/' + rel);
  }
})(DIST);

let failures = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failures++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`);
};

// 1. llms.txt links resolve
const txt = fs.readFileSync(path.join(DIST, 'llms.txt'), 'utf8');
const links = [...txt.matchAll(/\]\((https:\/\/leafcraftpro\.site[^)]*)\)/g)]
  .map((m) => new URL(m[1]).pathname);
const brokenLinks = links.filter((l) => !servable.has(l));
check('llms.txt links resolve', brokenLinks.length === 0,
  `${links.length} links` + (brokenLinks.length ? ' broken: ' + brokenLinks.join(', ') : ''));

// 2. llms.txt structure follows the v2 spec order
const lines = txt.split('\n');
check('llms.txt starts with H1', /^# /.test(lines[0]), lines[0]);
check('llms.txt has blockquote summary', lines.some((l) => /^> /.test(l)));
check('llms.txt has H2 sections', (txt.match(/^## /gm) || []).length >= 3,
  (txt.match(/^## /gm) || []).length + ' sections');
check('llms.txt ends with Optional', /^## Optional$/m.test(txt));

// 3. every link in llms.txt has a description after a colon
const undescribed = [...txt.matchAll(/^- \[[^\]]+\]\([^)]+\)$/gm)].length;
check('llms.txt links have notes', undescribed === 0, undescribed ? undescribed + ' without notes' : '');

// 4. markdown twins exist for posts and pages
const mdFiles = [];
(function collect(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) collect(f);
    else if (e.name.endsWith('.md')) mdFiles.push(path.relative(DIST, f).split(path.sep).join('/'));
  }
})(DIST);
check('markdown twins generated', mdFiles.length >= 50, mdFiles.length + ' files');
check('llms-full.txt present', fs.existsSync(path.join(DIST, 'llms-full.txt')));

// 5. fonts present and referenced
const fontDir = path.join(DIST, 'assets', 'fonts');
const fonts = fs.existsSync(fontDir) ? fs.readdirSync(fontDir) : [];
check('self-hosted fonts present', fonts.length === 6, fonts.length + ' files');
const css = fs.readFileSync(path.join(DIST, 'assets', 'css', 'style.css'), 'utf8');
const cssFontRefs = [...css.matchAll(/url\("\.\.\/fonts\/([^"]+)"\)/g)].map((m) => m[1]);
check('css references all fonts', cssFontRefs.every((f) => fonts.includes(f)),
  cssFontRefs.length + ' refs');
check('no google fonts left', !/url\((?:'|")https:\/\/fonts\.(googleapis|gstatic)/.test(css));

// 6. link relations advertised on pages
const post = fs.readFileSync(path.join(DIST, 'how-to-make-a-coil-basket.html'), 'utf8');
check('rel=describedby on pages', /rel="describedby"[^>]*llms\.txt/.test(post));
check('rel=alternate text/markdown', /rel="alternate"[^>]*type="text\/markdown"/.test(post));

// 7. robots.txt mentions llms.txt
const robots = fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8');
check('robots.txt mentions llms.txt', robots.includes('llms.txt'));

console.log('');
console.log(failures === 0 ? '  ALL CHECKS PASSED' : `  ${failures} CHECK(S) FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
