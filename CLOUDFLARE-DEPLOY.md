# Deploying LeafCraftPRO to Cloudflare Pages

This project deploys to **Cloudflare Pages** as a fully static site. Every one of
the 117 pages is pre-rendered into `dist/`, and Cloudflare serves that folder from
its edge network — no runtime, no server to keep alive, no cold starts.

**Start here:** run the build, then upload `dist/`.

```bash
npm install
npm run build      # writes dist/
```

---

## Current deployment

Live as of 2026-10-06.

| | |
|---|---|
| Pages project | `leafcraftpro` |
| Production URL | <https://leafcraftpro.pages.dev> |
| Custom domains | `leafcraftpro.site`, `www.leafcraftpro.site` (both active, Google Trust Services cert) |
| Production branch | `main` |
| DNS | `CNAME leafcraftpro.site` and `CNAME www.leafcraftpro.site` → `leafcraftpro.pages.dev`, both proxied |

The zone was already on Cloudflare, so no nameserver migration was needed. The
previous `A` record pointing at the Hostinger origin (`2.57.91.91`) was replaced
by the CNAME above. The `_dmarc`, `_domainkey` and `spf` TXT records were left
untouched — the domain sends no mail (`v=spf1 -all`), so nothing there can break.

**To roll back to Hostinger:** delete the two CNAMEs, recreate
`A leafcraftpro.site → 2.57.91.91` (proxied), and point
`CNAME www.leafcraftpro.site → leafcraftpro.site` (proxied).

**To redeploy after a content change:**

```bash
npm run build
npx wrangler pages deploy dist --project-name=leafcraftpro --branch=main
```

---

## 0. Why Pages and not Workers

Cloudflare Workers run JavaScript in a V8 isolate, not Node.js. Express cannot run
there — it needs `http.Server` and a listening socket, neither of which exists in
the Workers runtime. Porting this app to a Worker would mean replacing Express and
inlining every EJS template into the bundle.

None of that is necessary. This site has no database, no sessions and no
per-request logic — every page is a pure function of the content files in
`src/data/`. Pre-rendering gives the identical result, served from cache at the
edge, which is faster and cheaper than rendering on request.

| | Pages (static) | Workers (dynamic) |
|---|---|---|
| Works with this codebase as-is | yes | no — needs a rewrite |
| Cold starts | none | yes |
| Time to first byte | edge cache | worker execution |
| Cost | free tier is generous | free tier is generous |

If you later need genuinely dynamic behaviour, add **Pages Functions** for the
specific routes that need it. The static site keeps serving everything else.

---

## 1. What the build produces

```
dist/
├── index.html                  ← served at /
├── 404.html                    ← custom 404 (must be at the top level)
├── about.html                  ← served at /about
├── blog.html                   ← served at /blog
├── blog/
│   └── page/
│       └── 2.html              ← served at /blog/page/2
├── assets/                     ← CSS, JS, SVG
├── images/                     ← 401 WebP files
├── robots.txt  sitemap.xml  feed.xml  manifest.webmanifest  search-index.json
├── _headers                    ← response headers (Cloudflare reads this)
└── _redirects                  ← redirect rules (Cloudflare reads this)
```

### Why `.html` files and not `about/index.html`

Cloudflare Pages rewrites HTML to extension-less URLs, and the two forms do **not**
behave the same:

| On disk | Cloudflare serves | Redirect target |
|---|---|---|
| `about.html` | `/about` | `/about` — no trailing slash |
| `about/index.html` | `/about/` | **with** a trailing slash |

Every canonical URL this site emits has no trailing slash
(`https://leafcraftpro.site/about`). If the build emitted directory indexes,
every canonical would point at a URL that 308-redirects to a different one. The
build emits `about.html` for exactly this reason — see the comment block at the
top of `build.js`.

The build verifies this: after rendering, all 11,340 internal links resolve and
every canonical matches the URL Cloudflare will serve.

---

## 2. Deploy from the dashboard (recommended)

### 2.1 Connect the repository

1. Sign in at <https://dash.cloudflare.com> → **Workers & Pages** → **Create**
   → **Pages** → **Connect to Git**.
2. Authorise Cloudflare for the `leafcraftpro/leafcraftpro` repository and select
   it.
3. Configure the build:

   | Setting | Value |
   |---|---|
   | Production branch | `main` |
   | Framework preset | **None** |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | `leafcraft-node` |

   > **Root directory matters.** The Node project lives in the `leafcraft-node`
   > subfolder of the repository. If you leave this blank, the build looks for
   > `package.json` at the repository root, finds none, and fails.

4. Click **Save and Deploy**. The first build takes a couple of minutes.

Every push to `main` then rebuilds and redeploys automatically.

### 2.2 Or upload `dist/` directly

No Git connection needed:

1. Run `npm run build` locally.
2. **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
3. Name the project `leafcraftpro`, then drag the **contents** of `dist/` in —
   or the folder itself. Either works; what matters is that `index.html` ends up
   at the root of the upload.
4. Deploy.

Useful when you want to publish without touching Git, or to preview a change
before committing it.

---

## 3. Deploy with the CLI

```bash
npm run build
npx wrangler pages deploy dist
```

`wrangler.toml` already declares `pages_build_output_dir = "dist"`, so no extra
arguments are needed. On first run Wrangler opens a browser to authenticate —
sign in with the Cloudflare account that owns the project.

For CI, or to avoid the browser flow, create an API token instead:

1. <https://dash.cloudflare.com/profile/api-tokens> → **Create Token** →
   **Custom token**.
2. Permissions: **Account** → **Cloudflare Pages** → **Edit**.
3. Export it and deploy:

```bash
export CLOUDFLARE_API_TOKEN="your-token"
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
npx wrangler pages deploy dist
```

> Never commit the token. It grants write access to your Cloudflare account.

---

## 4. Point your domain at it

The project is live on `<project>.pages.dev` as soon as the first deploy finishes.
Verify there **before** touching DNS.

1. **Workers & Pages** → your project → **Custom domains** → **Set up a domain**.
2. Enter `leafcraftpro.site` and follow the prompt.

What happens next depends on where the domain's DNS lives:

**If the domain already uses Cloudflare nameservers** — Cloudflare adds the
records for you. Done.

**If DNS is still at Hostinger** — you have two options:

- *Move DNS to Cloudflare* (recommended). In hPanel, note your existing DNS
  records first — especially **MX records**, or email will break. Then change the
  nameservers at your registrar to the two Cloudflare gives you. Propagation
  usually takes under an hour.
- *Keep DNS at Hostinger* and add a `CNAME` record for `@` and `www` pointing at
  `<project>.pages.dev`. This works, but you lose Cloudflare's proxy features on
  that hostname and cannot use the automatic certificate management as cleanly.

Once the domain is attached, Cloudflare issues a TLS certificate automatically.
`https://leafcraftpro.site` will then serve the Pages project.

> **Before you switch DNS**, confirm the Pages deployment is complete and the
> `pages.dev` URL works. If the domain is the only place the site is reachable,
> moving DNS to a broken deployment takes the site offline.

---

## 5. Verify the deployment

Replace `<your-site>` with your `pages.dev` hostname or the custom domain.

```bash
# Every one of these should be 200
for p in / /blog /shop /about /blog/page/2 \
         /product/classic-palm-leaf-basket \
         /sitemap.xml /robots.txt /feed.xml \
         /assets/css/style.css /images/hero/main-1280.webp; do
  printf '%-40s ' "$p"
  curl -s -o /dev/null -w '%{http_code}\n' "https://<your-site>$p"
done

# Unknown paths must return your 404 page, not a Cloudflare error
curl -s -o /dev/null -w '%{http_code}\n' "https://<your-site>/does-not-exist"   # expect 404
```

Then confirm the response headers from `_headers` were applied:

```bash
curl -sI "https://<your-site>/" | grep -iE 'x-frame-options|content-security-policy|permissions-policy'
```

You should see all three. If they are missing, `_headers` did not reach the root
of the upload — check that `dist/_headers` exists and was deployed.

Finally, check that the canonical URLs point at the real domain:

```bash
curl -s "https://<your-site>/about" | grep -o '<link rel="canonical"[^>]*>'
```

It should read `https://leafcraftpro.site/about`. If it shows a `pages.dev`
hostname, you built before setting `SITE_URL` — see §6.

---

## 6. Configuration

### The canonical domain

Every canonical tag, Open Graph URL, sitemap entry and `robots.txt` line is
derived from one value in `src/config/site.js`:

```js
url: process.env.SITE_URL || 'https://leafcraftpro.site',
```

It already points at the production domain, so nothing needs changing. To build
for a different domain without editing the file:

```bash
SITE_URL=https://staging.example.com npm run build
```

On Cloudflare, set it as a build environment variable instead
(**Settings → Environment variables**) so the dashboard build picks it up.

### Response headers and caching

`deploy/cloudflare-headers.txt` becomes `dist/_headers`. It sets
`X-Frame-Options`, `Permissions-Policy` and a `Content-Security-Policy` matching
what the Express server sends, so the two deployments behave identically.

Two things to know before editing it:

**Cloudflare joins duplicate headers with a comma.** If you define
`Cache-Control` under both `/*` and `/images/*`, the browser receives both values
concatenated — not the more specific one. Define each header in exactly one rule,
or detach it first with `! Header-Name`.

**Cloudflare recommends against custom caching on Pages.** Assets are cached on
the CDN per deployment, and every response carries an `Etag`, so browsers
revalidate cheaply with a `304`. The default `Cache-Control: public, max-age=0,
must-revalidate` is intentional.

If you want long browser caching anyway, add a rule for images only — they are the
heavy assets and change rarely:

```
/images/*
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400
```

Be aware this can serve a stale image after a deploy until the browser cache
expires.

### Redirects

`deploy/cloudflare-redirects.txt` becomes `dist/_redirects`. It currently
contains one rule, sending `/index.html` to `/` so there is a single home-page
URL. Clean URLs need no rules — Pages handles `/about` → `about.html` natively.

---

## 7. Troubleshooting

**The build fails with "package.json not found"**
The **Root directory** is not set. It must be `leafcraft-node`.

**Pages serves an empty page for every URL**
There is no top-level `404.html`. Without it, Pages assumes a single-page app and
routes every unknown path to `/`. Confirm `dist/404.html` exists — the build
always writes it.

**Every canonical points at `*.pages.dev`**
The build ran before `SITE_URL` was set. Set it in **Settings → Environment
variables**, then redeploy. A cached build can also do this — use **Retry
deployment** after changing the variable.

**`/about` redirects to `/about/` and the canonical disagrees**
The build emitted `about/index.html` instead of `about.html`. Check that
`build.js` is the version in this repository — `outFileFor()` is what converts
the route output to `.html`.

**Headers from `_headers` are not applied**
`_headers` must sit at the **root of the deployed output**, not in a subfolder.
Confirm `dist/_headers` exists and that the build output directory is `dist`.

**Styles or images 404 after deploying**
`assets/` and `images/` must be inside the uploaded folder. If you used the
dashboard uploader, make sure you uploaded the *contents* of `dist/`, not just
the HTML files.

**The site works on `pages.dev` but not on the custom domain**
DNS has not propagated, or the domain was added to Pages but the nameservers
still point elsewhere. Check **Custom domains** for a pending status, and verify
with `dig leafcraftpro.site +short`.

---

## 8. Updating the site

Content lives in `src/data/`. Edit, build, deploy.

| What you want to change | File |
|---|---|
| Site name, domain, contact, social links, analytics | `src/config/site.js` |
| Blog posts (50 of them) | `src/data/posts/part-1.js` … `part-5.js` |
| Products (30 of them) | `src/data/products.js` |
| Topics and collections | `src/data/categories.js` |
| About, FAQ, policies, glossary | `src/data/pages.js` |
| CSS | `public/assets/css/style.css` |
| Front-end JavaScript | `public/assets/js/main.js` |

```bash
npm run build
npx wrangler pages deploy dist
```

If you connected the repository, pushing to `main` is enough — Cloudflare
rebuilds automatically.

> After changing `src/config/site.js`, the whole site must be rebuilt. Nothing is
> read at runtime on Pages; the values are baked into the HTML at build time.

---

## 9. Running the Node version instead

The same codebase still runs as a live Express server — useful for local
development, or for a host that gives you Node:

```bash
npm start              # http://localhost:3000
npm run preflight      # checks the folder can run the app
```

See `DEPLOY-HOSTINGER.md` for that path. The two deployments are independent:
the static export is generated from the same route table the server uses, so the
pages cannot drift apart.
