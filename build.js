/**
 * ============================================================
 *  Static site generator.
 *  Renders every route to a plain HTML file in dist/, plus the
 *  SEO files (sitemap.xml, robots.txt, feed.xml), the client
 *  search index and the Apache config for Hostinger.
 *
 *  Run with:  npm run build
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const PUBLIC = path.join(ROOT, 'public');
const DIST = path.join(ROOT, 'dist');

const log = (...a) => console.log('  ', ...a);

/** Recursively copy a directory. */
async function copyDir(src, dest) {
  await fsp.mkdir(dest, { recursive: true });
  const entries = await fsp.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
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
  const lines = [
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
    'Host: ' + site.url.replace(/^https?:\/\//, ''),
    '',
  ];
  return lines.join('\n');
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
  console.log(`\n${site.name} — static build`);
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
      await write(path.join(DIST, route.out), html);
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
  await write(
    path.join(DIST, 'search-index.json'),
    JSON.stringify(buildSearchIndex())
  );
  log('wrote sitemap.xml, robots.txt, feed.xml, manifest.webmanifest, search-index.json');

  // 4. Apache config for the static deployment.
  const htaccess = await fsp.readFile(path.join(ROOT, 'deploy', 'htaccess-static.txt'), 'utf8');
  await write(path.join(DIST, '.htaccess'), htaccess);
  log('wrote .htaccess');

  // 5. Report.
  const stats = dirStats(DIST);
  const pages = routes.length;

  console.log('\n  --------------------------------');
  log(`pages generated : ${pages}`);
  log(`files written   : ${stats.files}`);
  log(`output size     : ${(stats.bytes / 1024 / 1024).toFixed(2)} MB`);
  log(`build time      : ${((Date.now() - started) / 1000).toFixed(1)}s`);
  log(`output folder   : dist/`);
  console.log('  --------------------------------\n');
  console.log('  Upload the CONTENTS of dist/ to public_html on Hostinger.');
  console.log('  See DEPLOY-HOSTINGER.md for the full walkthrough.\n');
}

build().catch((err) => {
  console.error('\nBuild failed:', err.message);
  process.exit(1);
});
