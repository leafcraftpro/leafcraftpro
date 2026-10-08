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
import {
  postToMarkdown,
  pageToMarkdown,
  homeToMarkdown,
  blogIndexToMarkdown,
  shopIndexToMarkdown,
  buildLlmsTxt,
  buildLlmsFullTxt,
} from './src/lib/markdown.js';
import products from './src/data/products.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, 'public');

/**
 * Passenger (Hostinger's "Setup Node.js App") does NOT hand the
 * application a port number — it sets PORT to the path of a Unix
 * domain socket. Calling `listen(port, host)` with a socket path makes
 * Node read the host string as the backlog, which throws
 * ERR_INVALID_ARG_TYPE and kills the process during boot. LiteSpeed
 * then serves its "503 Service Unavailable — the server is temporarily
 * busy" page.
 *
 * So: bind to the socket when we are given one, and to a TCP port
 * otherwise. Never pass a host alongside a socket path.
 */
const RAW_PORT = process.env.PORT;
const IS_SOCKET = typeof RAW_PORT === 'string' && /[\\/]/.test(RAW_PORT);
const IS_PROD = process.env.NODE_ENV === 'production';

// Log failures instead of dying silently — these end up in the
// Hostinger Node.js log and are the difference between a 503 you can
// diagnose and one you cannot.
process.on('unhandledRejection', (err) => {
  console.error('[leafcraftpro] Unhandled promise rejection:', err);
});
process.on('uncaughtException', (err) => {
  console.error('[leafcraftpro] Uncaught exception:', err);
  process.exit(1);
});

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
        // Only force HTTPS upgrades when we are actually serving over
        // HTTPS. Disabling it with `null` in development keeps localhost
        // working; omitting the key entirely leaves helmet's default on.
        ...(IS_PROD ? {} : { upgradeInsecureRequests: null }),
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

/**
 * Web app manifest. `base.ejs` links to it, so it has to exist or the
 * browser logs a 404 on every page load.
 */
app.get('/manifest.webmanifest', (req, res) => {
  res.type('application/manifest+json').send(
    JSON.stringify(
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
          {
            src: relUrl('assets/img/icon-192.png'),
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: relUrl('assets/img/icon-512.png'),
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: relUrl('assets/img/icon-512.png'),
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      null,
      2
    )
  );
});

/**
 * Health check. Visit /healthz on the deployed site to tell the two
 * failure modes apart:
 *   - JSON response  → the Node app IS running; a problem elsewhere
 *                      (usually .htaccess or the domain root)
 *   - 503 page       → Passenger could not start the app at all; read
 *                      the Node.js log in hPanel
 */
app.get('/healthz', (req, res) => {
  res.type('application/json').send(
    JSON.stringify(
      {
        ok: true,
        app: site.name,
        node: process.version,
        mode: IS_PROD ? 'production' : 'development',
        listening: IS_SOCKET ? 'unix socket' : `tcp:${Number(RAW_PORT) || 3000}`,
        routes: routes.length,
        uptime: Math.round(process.uptime()),
      },
      null,
      2
    )
  );
});

// ---- HTML routes ------------------------------------------------

/**
 * Markdown output for language models — see src/lib/markdown.js and
 * the llms.txt proposal at https://llmstxt.org.
 */
app.get('/llms.txt', (req, res) => {
  res
    .type('text/plain')
    .set('Cache-Control', 'public, max-age=0, must-revalidate')
    .send(buildLlmsTxt());
});

app.get('/llms-full.txt', (req, res) => {
  res
    .type('text/plain')
    .set('Cache-Control', 'public, max-age=0, must-revalidate')
    .send(buildLlmsFullTxt());
});

/**
 * Markdown twin of a page: /about.md, /how-to-make-a-coil-basket.md, and
 * /index.md for the home page. Anything without a twin falls through to 404.
 */
app.get(/^\/(.+)\.md$/, (req, res, next) => {
  const slug = req.params[0];
  const key = slug === 'index' ? '' : slug;
  const route = routeMap.get(key);
  if (!route) return next();

  const src = route.data || {};
  let md = null;

  if (src.post) md = postToMarkdown(src.post);
  else if (src.page) md = pageToMarkdown(src.page);
  // The list pages have no single source object, so build them from the
  // collections directly — the same functions the static build uses.
  else if (key === '') md = homeToMarkdown();
  else if (key === 'blog') md = blogIndexToMarkdown();
  else if (key === 'shop') md = shopIndexToMarkdown(products);

  if (!md) return next();

  res
    .type('text/markdown')
    .set('Cache-Control', 'public, max-age=0, must-revalidate')
    .send(md);
});

app.get(/.*/, async (req, res, next) => {
  const key = decodeURIComponent(req.path).replace(/^\/+|\/+$/g, '');
  const route = routeMap.get(key);

  if (!route) return next();

  try {
    const html = await render(route.view, {
      ...route.data,
      manifest,
      seo: route.page,
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
      seo: notFound.page,
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

const server = IS_SOCKET
  ? app.listen(RAW_PORT)
  : app.listen(Number(RAW_PORT) || 3000, process.env.HOST || '0.0.0.0');

server.on('listening', () => {
  const where = IS_SOCKET ? `unix socket ${RAW_PORT}` : `http://localhost:${Number(RAW_PORT) || 3000}`;
  console.log(`\n${site.name} is running`);
  console.log(`  listening : ${where}`);
  console.log(`  routes    : ${routes.length}`);
  console.log(`  mode      : ${IS_PROD ? 'production' : 'development'}`);
  console.log(`  site url  : ${site.url}\n`);
});

server.on('error', (err) => {
  console.error(`\n[leafcraftpro] Failed to start: ${err.code || err.message}`);
  if (err.code === 'EADDRINUSE') {
    console.error(`  ${RAW_PORT} is already in use — another instance is probably still running.`);
  } else if (err.code === 'EACCES') {
    console.error(`  Not permitted to bind to ${RAW_PORT}. On shared hosting, let the host assign PORT.`);
  } else if (err.code === 'ENOENT') {
    console.error(`  Socket path does not exist: ${RAW_PORT}`);
  }
  process.exit(1);
});

export default app;
