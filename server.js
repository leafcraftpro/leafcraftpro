/**
 * ============================================================
 *  LeafCraftPRO — live Node.js server.
 *  Renders every page on request from the same route table the
 *  static build uses, so both deployment paths stay identical.
 *
 *  Start with:  npm start        (default port 3000)
 *  Hostinger:   set the application startup file to server.js
 * ============================================================
 */

import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { render } from './src/lib/render.js';
import { buildRoutes, buildSearchIndex, sitemapEntries } from './src/routes.js';
import { site, absoluteUrl, relUrl } from './src/config/site.js';
import manifest from './src/data/manifest.js';
import { excerpt } from './src/lib/helpers.js';
import { postsByDate } from './src/data/posts/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, 'public');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const IS_PROD = process.env.NODE_ENV === 'production';

// ---- Route lookup ----------------------------------------------
// Built once at boot. Restart the app to pick up content changes.
const routes = buildRoutes();
const routeMap = new Map(routes.map((r) => [r.url.replace(/^\/+|\/+$/g, ''), r]));

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', true);

app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://www.googletagmanager.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://www.google-analytics.com'],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'", 'mailto:'],
        upgradeInsecureRequests: IS_PROD ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: IS_PROD ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
  })
);

// ---- Static assets with long-lived caching ----------------------
app.use(
  express.static(PUBLIC, {
    maxAge: IS_PROD ? '1y' : 0,
    immutable: IS_PROD,
    etag: true,
    lastModified: true,
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      }
      if (/\.(webp|svg|woff2?)$/.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  })
);

// ---- SEO + data endpoints --------------------------------------

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(buildRobotsTxt());
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml').send(buildSitemapXml());
});

app.get('/feed.xml', (req, res) => {
  res.type('application/rss+xml').send(buildFeedXml());
});

app.get('/search-index.json', (req, res) => {
  res.type('application/json').send(JSON.stringify(buildSearchIndex()));
});

// ---- HTML routes ------------------------------------------------

app.get(/.*/, async (req, res, next) => {
  const key = decodeURIComponent(req.path).replace(/^\/+|\/+$/g, '');
  const route = routeMap.get(key);

  if (!route) return next();

  try {
    const html = await render(route.view, {
      ...route.data,
      manifest,
      page: route.page,
      current: route.current || '',
      bodyClass: route.bodyClass || '',
    });
    res.type('html').set('Cache-Control', 'public, max-age=0, must-revalidate').send(html);
  } catch (err) {
    next(err);
  }
});

// ---- 404 --------------------------------------------------------

app.use(async (req, res) => {
  const notFound = routeMap.get('404');
  try {
    const html = await render(notFound.view, {
      ...notFound.data,
      manifest,
      page: notFound.page,
      current: '/404',
      bodyClass: '',
    });
    res.status(404).type('html').send(html);
  } catch {
    res.status(404).type('text').send('404 — Not found');
  }
});

// ---- Errors -----------------------------------------------------

app.use((err, req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).type('text').send('500 — Something went wrong on our side.');
});

// ---- Helpers for the SEO endpoints ------------------------------

function xmlEscape(s) {
  return String(s).replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
  })[c]);
}

function buildSitemapXml() {
  const entries = sitemapEntries();
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((e) => `  <url><loc>${xmlEscape(e.loc)}</loc><lastmod>${e.lastmod}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`).join('\n')}
</urlset>
`;
}

function buildRobotsTxt() {
  return `# robots.txt — ${site.name}
User-agent: *
Allow: /
Disallow: /search
Disallow: /404.html

User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

Sitemap: ${absoluteUrl('sitemap.xml')}
`;
}

function buildFeedXml() {
  const items = postsByDate.slice(0, 30).map((p) => `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${xmlEscape(absoluteUrl(p.slug))}</link>
      <guid isPermaLink="true">${xmlEscape(absoluteUrl(p.slug))}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <description>${xmlEscape(excerpt(p.excerpt || p.intro, 300))}</description>
    </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xmlEscape(site.name)} — Craft Guides</title>
    <link>${xmlEscape(absoluteUrl('blog'))}</link>
    <description>${xmlEscape(site.shortDescription)}</description>
    <language>${site.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

// ---- Boot -------------------------------------------------------

app.listen(PORT, HOST, () => {
  console.log(`\n${site.name} is running`);
  console.log(`  local:   http://localhost:${PORT}`);
  console.log(`  routes:  ${routes.length}`);
  console.log(`  mode:    ${IS_PROD ? 'production' : 'development'}\n`);
});

export default app;
