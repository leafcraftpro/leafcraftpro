/**
 * ============================================================
 *  Build verifier.
 *  Walks every generated HTML file and checks that:
 *    - every internal link resolves to a real file
 *    - every <img src> and srcset entry exists on disk
 *    - every JSON-LD block is valid JSON
 *    - every page has exactly one <h1>, a title and a canonical
 *  Exits non-zero if anything fails.
 *
 *  Run with:  node scripts/verify.js
 * ============================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');

const errors = [];
const warnings = [];
let pagesChecked = 0;
let linksChecked = 0;
let imagesChecked = 0;
let schemasChecked = 0;

/** Recursively collect every .html file. */
function htmlFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) htmlFiles(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Does this URL path resolve to a file in dist/? */
function resolves(urlPath) {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  if (!clean.startsWith('/')) return true; // external or relative
  const target = path.join(DIST, clean);

  if (fs.existsSync(target)) {
    const stat = fs.statSync(target);
    if (stat.isFile()) return true;
    if (stat.isDirectory()) return fs.existsSync(path.join(target, 'index.html'));
  }
  if (fs.existsSync(target + '.html')) return true;
  if (fs.existsSync(path.join(target, 'index.html'))) return true;
  return false;
}

if (!fs.existsSync(DIST)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const files = htmlFiles(DIST);

for (const file of files) {
  const rel = path.relative(DIST, file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');
  pagesChecked++;

  // ---- title ----
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  if (!titleMatch || titleMatch[1].length < 10) {
    errors.push(`${rel}: missing or too-short <title>`);
  } else {
    const t = titleMatch[1];
    if (t.length > 65) {
      warnings.push(`${rel}: title is ${t.length} chars — Google truncates around 60`);
    }
    // The brand should appear once, not twice.
    const brandCount = (t.match(/LeafCraftPRO/gi) || []).length;
    if (brandCount > 1) {
      errors.push(`${rel}: brand name appears ${brandCount}× in the title — "${t}"`);
    }
  }

  // ---- canonical (skip the 404) ----
  if (rel !== '404.html' && !/<link rel="canonical"/.test(html)) {
    errors.push(`${rel}: missing canonical link`);
  }

  // ---- meta description ----
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
  if (!descMatch || descMatch[1].length < 40) {
    errors.push(`${rel}: missing or too-short meta description`);
  } else if (descMatch[1].length > 160) {
    warnings.push(`${rel}: description is ${descMatch[1].length} chars — Google truncates around 158`);
  }

  // ---- exactly one h1 ----
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1 && rel !== '404.html') {
    warnings.push(`${rel}: found ${h1s} <h1> elements (expected 1)`);
  }

  // ---- images ----
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    const src = (tag.match(/\bsrc="([^"]+)"/) || [])[1];
    if (src) {
      imagesChecked++;
      if (src.startsWith('/') && !resolves(src)) {
        errors.push(`${rel}: img src not found → ${src}`);
      }
    }
    const srcset = (tag.match(/\bsrcset="([^"]+)"/) || [])[1];
    if (srcset) {
      for (const part of srcset.split(',')) {
        const url = part.trim().split(/\s+/)[0];
        if (url && url.startsWith('/')) {
          imagesChecked++;
          if (!resolves(url)) errors.push(`${rel}: srcset entry not found → ${url}`);
        }
      }
    }
    if (!/\balt="/.test(tag)) {
      errors.push(`${rel}: <img> without alt attribute`);
    }
  }

  // ---- internal links ----
  for (const m of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const href = m[1];
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    if (/^https?:\/\//i.test(href)) continue;
    linksChecked++;
    if (!resolves(href)) errors.push(`${rel}: broken link → ${href}`);
  }

  // ---- JSON-LD ----
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    schemasChecked++;
    try {
      const parsed = JSON.parse(m[1]);
      if (!parsed['@graph'] && !parsed['@type']) {
        errors.push(`${rel}: JSON-LD block has no @type or @graph`);
      }
    } catch (err) {
      errors.push(`${rel}: invalid JSON-LD — ${err.message}`);
    }
  }

  // ---- HTML comment balance ----
  // An unclosed `<!--` swallows every element after it: the browser
  // parses the rest of the document as comment text and whole sections
  // silently vanish from the DOM while still being present in the file.
  const commentOpens = (html.match(/<!--/g) || []).length;
  const commentCloses = (html.match(/-->/g) || []).length;
  if (commentOpens !== commentCloses) {
    errors.push(
      `${rel}: unbalanced HTML comments (${commentOpens} opened, ${commentCloses} closed) — ` +
      'content after an unclosed comment will not render'
    );
  }

  // ---- Tag balance for the containers that matter ----
  for (const tag of ['section', 'div', 'article', 'ul', 'li']) {
    const opens = (html.match(new RegExp(`<${tag}\\b`, 'g')) || []).length;
    const closes = (html.match(new RegExp(`</${tag}>`, 'g')) || []).length;
    if (opens !== closes) {
      warnings.push(`${rel}: <${tag}> open/close mismatch (${opens}/${closes})`);
    }
  }
}

// ---- SEO file sanity ----
const required = ['sitemap.xml', 'robots.txt', 'feed.xml', 'search-index.json', 'manifest.webmanifest', '404.html'];
for (const f of required) {
  if (!fs.existsSync(path.join(DIST, f))) errors.push(`missing required file: ${f}`);
}

// ---- sitemap URLs all resolve ----
const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const loc of locs) {
  const urlPath = loc.replace(/^https?:\/\/[^/]+/, '') || '/';
  if (!resolves(urlPath)) errors.push(`sitemap.xml: URL does not resolve → ${loc}`);
}

// ---- report ----
console.log('\n  LeafCraftPRO — build verification\n');
console.log('  --------------------------------');
console.log(`   pages checked   : ${pagesChecked}`);
console.log(`   links checked   : ${linksChecked}`);
console.log(`   images checked  : ${imagesChecked}`);
console.log(`   schema blocks   : ${schemasChecked}`);
console.log(`   sitemap URLs    : ${locs.length}`);
console.log('  --------------------------------');

if (warnings.length) {
  console.log(`\n  ${warnings.length} warning(s):`);
  warnings.slice(0, 20).forEach((w) => console.log(`    · ${w}`));
  if (warnings.length > 20) console.log(`    … and ${warnings.length - 20} more`);
}

if (errors.length) {
  console.log(`\n  ${errors.length} error(s):`);
  errors.slice(0, 40).forEach((e) => console.log(`    ✗ ${e}`));
  if (errors.length > 40) console.log(`    … and ${errors.length - 40} more`);
  console.log('');
  process.exit(1);
}

console.log('\n  All checks passed.\n');
