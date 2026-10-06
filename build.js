/**
 * ============================================================
 *  LeafCraftPRO — static export for Cloudflare Pages.
 *
 *  Renders every route to a plain HTML file in dist/, plus the
 *  SEO files and the Cloudflare configuration files.
 *
 *  Run with:  npm run build
 *
 *  Why `.html` files and not `about/index.html`
 *  --------------------------------------------
 *  Cloudflare Pages rewrites HTML to extension-less URLs:
 *
 *    /about.html        ->  /about        (no trailing slash)
 *    /about/index.html  ->  /about/       (WITH a trailing slash)
 *
 *  Every canonical URL this site emits has no trailing slash
 *  (https://leafcraftpro.site/about), so the build must emit
 *  `about.html`. Emitting directory indexes instead would make
 *  each canonical point at a URL that 308-redirects elsewhere.
 *
 *  The root `index.html` and `404.html` keep their names: Pages
 *  serves `/` from the former, and uses the latter as the custom
 *  404 page (without a top-level 404.html, Pages assumes an SPA
 *  and matches every unknown path to `/`).
 * ============================================================
 */

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { render } from './src/lib/render.js';
import { buildRoutes, buildSearchIndex, sitemapEntries } from './src/routes.js';
import { site, absoluteUrl, relUrl } from './src/config/site.js';
import { postsByDate } from './src/data/posts/index.js';
import products from './src/data/products.js';
import manifest from './src/data/manifest.js';
import { excerpt } from './src/lib/helpers.js';
import {
  postToMarkdown,
  pageToMarkdown,
  homeToMarkdown,
  blogIndexToMarkdown,
  shopIndexToMarkdown,
  buildLlmsTxt,
  buildLlmsFullTxt,
} from './src/lib/markdown.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const PUBLIC = path.join(ROOT, 'public');
const DIST = path.join(ROOT, 'dist');
const DEPLOY = path.join(ROOT, 'deploy');

const log = (...a) => console.log('  ', ...a);

/**
 * Map a route to its output file.
 *
 * `about/index.html` -> `about.html`   (Pages strips to /about)
 * `index.html`       -> `index.html`   (root stays put)
 * `404.html`         -> `404.html`     (Pages needs this exact name)
 */
function outFileFor(route) {
  const out = route.out;
  if (out === 'index.html' || out === '404.html') return out;
  if (out.endsWith('/index.html')) return out.slice(0, -'/index.html'.length) + '.html';
  return out;
}

/** Recursively copy a directory. */
async function copyDir(src, dest) {
  await fsp.mkdir(dest, { recursive: true });
  for (const entry of await fsp.readdir(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(from, to);
    else await fsp.copyFile(from, to);
  }
}

/** Write a file, creating parent directories as needed. */
async function write(file, contents) {
  await fsp.mkdir(path.dirname(file), { recursive: true });
  await fsp.writeFile(file, contents);
}

/** Recursively measure a directory. */
function dirStats(dir) {
  let bytes = 0;
  let files = 0;
  const walk = (d) => {
    if (!fs.existsSync(d)) return;
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else {
        bytes += fs.statSync(full).size;
        files++;
      }
    }
  };
  walk(dir);
  return { bytes, files };
}

// ----------------------------------------------------------------
//  SEO file generators
// ----------------------------------------------------------------

function xmlEscape(s) {
  return String(s).replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
  })[c]);
}

function buildSitemap() {
  const entries = sitemapEntries();
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${xmlEscape(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;
}

function buildRobots() {
  return [
    '# robots.txt — ' + site.name,
    '# Generated automatically by build.js. Edit buildRobots() to change it.',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    '# The search page has no crawlable content of its own.',
    'Disallow: /search',
    'Disallow: /search?',
    'Disallow: /404.html',
    '',
    '# Be polite to small crawlers.',
    'Crawl-delay: 1',
    '',
    '# Block AI scrapers that do not send traffic back.',
    'User-agent: GPTBot',
    'Disallow: /',
    '',
    'User-agent: CCBot',
    'Disallow: /',
    '',
    'User-agent: Google-Extended',
    'Disallow: /',
    '',
    'Sitemap: ' + absoluteUrl('sitemap.xml'),
    '',
    '# For language models and agents:',
    '# ' + absoluteUrl('llms.txt') + ' — curated index of the guides',
    '# ' + absoluteUrl('llms-full.txt') + ' — every guide in full, one file',
    '# Any page also has a markdown twin: append .md to its URL.',
    '',
  ].join('\n');
}

function buildFeed() {
  const items = postsByDate.slice(0, 30).map((p) => {
    const url = absoluteUrl(p.slug);
    return `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <category>${xmlEscape(p.category ? p.category.name : 'Craft')}</category>
      <description>${xmlEscape(excerpt(p.excerpt || p.intro, 300))}</description>
      <enclosure url="${xmlEscape(absoluteUrl(`images/og/${p.slug}-og.webp`))}" type="image/webp" length="0"/>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(site.name)} — Craft Guides</title>
    <link>${xmlEscape(absoluteUrl('blog'))}</link>
    <description>${xmlEscape(site.shortDescription)}</description>
    <language>${site.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${xmlEscape(absoluteUrl('feed.xml'))}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

function buildWebManifest() {
  return JSON.stringify(
    {
      name: `${site.name} — ${site.tagline}`,
      short_name: site.name,
      description: site.shortDescription,
      start_url: relUrl(''),
      scope: relUrl(''),
      display: 'standalone',
      background_color: '#FCFAF3',
      theme_color: site.themeColor,
      lang: site.language,
      icons: [
        { src: relUrl('assets/img/favicon.svg'), sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      ],
    },
    null,
    2
  );
}

// ----------------------------------------------------------------
//  Main build
// ----------------------------------------------------------------

async function build() {
  const started = Date.now();
  console.log(`\n${site.name} — static export`);
  console.log(`  domain: ${site.url}\n`);

  // 1. Clean and copy static assets.
  await fsp.rm(DIST, { recursive: true, force: true });
  await fsp.mkdir(DIST, { recursive: true });
  await copyDir(PUBLIC, DIST);
  log('copied public/ → dist/');

  // 2. Render every route.
  const routes = buildRoutes();
  let ok = 0;
  const failures = [];

  for (const route of routes) {
    try {
      const html = await render(route.view, {
        ...route.data,
        manifest,
        page: route.page,
        current: route.current || '',
        bodyClass: route.bodyClass || '',
      });
      await write(path.join(DIST, outFileFor(route)), html);
      ok++;
    } catch (err) {
      failures.push({ url: route.url || '/', error: err.message });
    }
  }

  log(`rendered ${ok}/${routes.length} pages`);
  if (failures.length) {
    console.error('\n  Failed routes:');
    for (const f of failures) console.error(`    /${f.url} — ${f.error}`);
    throw new Error(`${failures.length} route(s) failed to render`);
  }

  // 3. SEO + data files.
  await write(path.join(DIST, 'sitemap.xml'), buildSitemap());
  await write(path.join(DIST, 'robots.txt'), buildRobots());
  await write(path.join(DIST, 'feed.xml'), buildFeed());
  await write(path.join(DIST, 'manifest.webmanifest'), buildWebManifest());
  await write(path.join(DIST, 'search-index.json'), JSON.stringify(buildSearchIndex()));
  log('wrote sitemap.xml, robots.txt, feed.xml, manifest.webmanifest, search-index.json');

  // 3b. Markdown twins and the llms.txt files.
  //     The llms.txt proposal recommends that pages an agent might need also
  //     exist as clean markdown at the same URL with the extension changed.
  //     These sit alongside the HTML rather than replacing it.
  let mdCount = 0;
  for (const route of routes) {
    const src = route.data || {};
    let md = null;
    if (src.post) md = postToMarkdown(src.post);
    else if (src.page) md = pageToMarkdown(src.page);
    if (!md) continue;

    const out = outFileFor(route);
    if (out === '404.html') continue;
    await write(path.join(DIST, out.replace(/\.html$/, '.md')), md);
    mdCount++;
  }
  // Index pages have no single source object, so build their twins directly.
  await write(path.join(DIST, 'index.md'), homeToMarkdown());
  await write(path.join(DIST, 'blog.md'), blogIndexToMarkdown());
  await write(path.join(DIST, 'shop.md'), shopIndexToMarkdown(products));
  mdCount += 3;

  await write(path.join(DIST, 'llms.txt'), buildLlmsTxt());
  await write(path.join(DIST, 'llms-full.txt'), buildLlmsFullTxt());
  log(`wrote ${mdCount} markdown twins + llms.txt + llms-full.txt`);

  // 4. Cloudflare Pages configuration.
  //    `_headers` and `_redirects` are read from the build output root and
  //    are not themselves served.
  await fsp.copyFile(
    path.join(DEPLOY, 'cloudflare-headers.txt'),
    path.join(DIST, '_headers')
  );
  await fsp.copyFile(
    path.join(DEPLOY, 'cloudflare-redirects.txt'),
    path.join(DIST, '_redirects')
  );
  log('wrote _headers and _redirects');

  // 5. Report.
  const stats = dirStats(DIST);
  const htmlFiles = routes.length;
  const badShape = routes.filter((r) => outFileFor(r) !== 'index.html' && outFileFor(r).endsWith('/index.html'));

  console.log('\n  --------------------------------');
  log(`pages generated : ${htmlFiles}`);
  log(`files written   : ${stats.files}`);
  log(`output size     : ${(stats.bytes / 1024 / 1024).toFixed(2)} MB`);
  log(`build time      : ${((Date.now() - started) / 1000).toFixed(1)}s`);
  log(`output folder   : dist/`);
  console.log('  --------------------------------\n');
  console.log('  Deploy with:  npx wrangler pages deploy dist');
  console.log('  Or upload dist/ at Cloudflare dashboard → Workers & Pages.');
  console.log('  See CLOUDFLARE-DEPLOY.md for the full walkthrough.\n');

  if (badShape.length) {
    console.warn(`  Warning: ${badShape.length} route(s) still end in /index.html.`);
  }
}

build().catch((err) => {
  console.error('\nBuild failed:', err.message);
  process.exit(1);
});
