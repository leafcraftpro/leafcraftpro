# Deploying LeafCraftPRO to Hostinger

A complete, start-to-finish walkthrough. There are two supported deployment
paths — pick one, you do not need both.

| | **Option A — Static upload** | **Option B — Node.js app** |
|---|---|---|
| What you upload | one folder of plain HTML/CSS/JS | the whole project, run by Node |
| Hostinger feature | File Manager or FTP | hPanel → *Setup Node.js App* |
| PageSpeed | best possible | very good |
| Node runtime needed on the server | no | yes |
| Rebuild to change content | yes | yes (then restart) |
| Recommended for | almost everyone | if you want the server to render on request |

**Start with Option A unless you have a specific reason not to.** It is faster,
cheaper to run, has fewer moving parts and nothing can crash at 2am.

---

## 0. Before you begin

**What you need**

- A Hostinger account with a hosting plan (any shared plan works)
- Your domain pointing at Hostinger (or use the free subdomain for now)
- Node.js 18 or newer on your own computer, to build the site
- The project folder, with `npm install` already run once

**What this project is**

A Node.js web application that generates a complete, SEO-optimised website:
117 pages, 50 in-depth craft guides, 30 products, a working client-side search,
auto-generated JSON-LD schema on every page, plus `sitemap.xml`, `robots.txt`
and an RSS feed. There is no database and no admin panel — content lives in
plain JavaScript files under `src/data/`.

---

## 1. Build the site on your own computer

Open a terminal in the project folder and run these three commands, in order.

```bash
npm install          # once — installs the build tools
npm run images       # optional — regenerates the WebP images from .raw-images
npm run build        # generates the whole site into dist/
```

You should see something like:

```
LeafCraftPRO — static build
  domain: https://leafcraftpro.site

   copied public/ → dist/
   rendered 117/117 pages
   wrote sitemap.xml, robots.txt, feed.xml, manifest.webmanifest, search-index.json
   wrote .htaccess

  --------------------------------
   pages generated : 117
   files written   : 529
   output size     : 31.81 MB
  --------------------------------
```

**Before you build for real, set your domain.** Open `src/config/site.js` and
change this one line:

```js
url: process.env.SITE_URL || 'https://leafcraftpro.site',
```

Everything SEO-related — canonical tags, Open Graph URLs, the sitemap, the RSS
feed, `robots.txt` — is derived from that value. Get it right before you build.

> You can also override it without editing the file:
> `SITE_URL=https://yourdomain.com npm run build`

**Verify the build before uploading.** This catches broken links, missing
images and malformed schema:

```bash
node scripts/verify.js
```

Expected output ends with `All checks passed.`

You can also preview the real built output locally, exactly as Hostinger will
serve it:

```bash
npm run serve:dist     # then open http://localhost:4000
```

---

## 2. Option A — Static upload (recommended)

### 2.1 Upload the files

**The fast way — one zip.** The repository ships `leafcraftpro-site.zip`, which
already contains the whole built site (532 files, `.htaccess` included). It is
regenerated with `npm run package`.

1. Log in to **hPanel** → **Files** → **File Manager**.
2. Open the `public_html` folder for your domain.
   - If `public_html` already contains a `default.php` or an `index.html` from
     a previous install, **delete it first** — otherwise it will shadow your
     home page.
   - If an earlier deployment is still there, clear it out completely. Mixing
     two deployments is a common source of confusing 503s and 404s.
3. Upload `leafcraftpro-site.zip`, then click **Extract**.
   - Extract it **into `public_html`**, not into a subfolder. The archive
     contains the *contents* of `dist/`, so `public_html/index.html` must exist
     when you are done.
4. Delete the zip afterwards.

**Why a zip rather than loose files:** the browser uploader is slow with 532
files and frequently **drops the hidden `.htaccess`**, which silently breaks
every clean URL. Extraction on the server preserves it.

**The manual way — upload the contents of `dist/`.** Upload **the contents of
`dist/`**, not the `dist` folder itself.

**If you have a lot of files**, FTP is faster and more reliable than the browser
uploader. Use the FTP details from hPanel → **Files** → **FTP Accounts**, and
upload with FileZilla or WinSCP. Set the transfer type to **Binary** and enable
**Auto** transfer mode.

**If you prefer the terminal**, Hostinger gives you SSH access on most plans:

```bash
# Build an archive locally first
cd leafcraft-node
tar -czf ../leafcraft-dist.tar.gz -C dist .

# Then on the server
cd ~/domains/yourdomain.com/public_html
rm -f default.php
tar -xzf ~/leafcraft-dist.tar.gz
```

### 2.2 Make sure `.htaccess` came across

`dist/.htaccess` is a hidden file. Many FTP clients skip hidden files by default.

- **FileZilla:** Server → *Force showing hidden files*
- **File Manager:** Settings → *Show hidden files*

Confirm `.htaccess` is in `public_html`. It handles clean URLs, the 404 page,
GZIP compression, browser caching and security headers. Without it, `/blog`
will 404 and `/blog/` may not resolve.

### 2.3 Point the domain and enable SSL

1. hPanel → **Domains** → confirm your domain is connected to this hosting plan.
2. hPanel → **Security** → **SSL** → install the free Let's Encrypt certificate.
   This usually takes a few minutes.
3. Once SSL is active, open `public_html/.htaccess` and **uncomment the HTTPS
   redirect** (remove the `#` from the four lines):

   ```apache
   RewriteCond %{HTTPS} off
   RewriteCond %{HTTP:X-Forwarded-Proto} !https
   RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
   ```

   Do this **after** SSL is working, never before — enabling it early locks you
   out of the site with a redirect loop.

### 2.4 Confirm it works

Visit these URLs in order. Every one should return a 200 and render correctly:

```
https://yourdomain.com/                 → home page
https://yourdomain.com/blog             → guide index
https://yourdomain.com/shop             → product index
https://yourdomain.com/sitemap.xml      → XML sitemap
https://yourdomain.com/robots.txt       → robots file
https://yourdomain.com/feed.xml         → RSS feed
https://yourdomain.com/nonexistent      → your 404 page
```

If `/blog` returns a Hostinger 404 rather than your own 404 page, `.htaccess`
did not upload. Re-upload it and make sure `mod_rewrite` is enabled (it is by
default on Hostinger).

---

## 3. Option B — Node.js app

Use this only if you want the server to render pages on request. The static
build is still required for the assets, so do **Step 1 first**.

### 3.1 Create the application in hPanel

1. hPanel → **Advanced** → **Node.js** (sometimes under *Website* → *Node.js*).
2. Click **Create application** and fill in:

   | Field | Value |
   |---|---|
   | Node.js version | 18, 20 or 22 |
   | Application root | `domains/yourdomain.com/app` |
   | Application URL | `yourdomain.com` |
   | Application startup file | `server.js` |

3. Click **Create**. Hostinger provisions a virtual environment and an
   `app.js`/`server.js` stub inside the application root.

### 3.2 Upload the project

Upload the **entire project** — not `dist/` — into the application root you
chose. Exclude `node_modules`; you will install dependencies on the server.

```bash
# From your computer
tar --exclude=node_modules --exclude=dist --exclude=.raw-images \
    -czf leafcraft-app.tar.gz -C leafcraft-node .

# On the server (via SSH, in the application root)
tar -xzf leafcraft-app.tar.gz
```

Then install and build on the server:

```bash
source /home/USERNAME/nodevenv/domains/yourdomain.com/app/22/bin/activate
cd ~/domains/yourdomain.com/app
npm install --omit=dev
npm run build          # generates dist/ and the SEO files
```

> `npm run build` needs the dev dependency `sharp` only if you also run
> `npm run images`. The optimised WebP files are already committed, so a plain
> `npm run build` works with production dependencies alone.

### 3.3 Restart and check

1. In hPanel → **Node.js**, click **Restart** on your application.
2. Visit `https://yourdomain.com/healthz`. You should get JSON back:

   ```json
   { "ok": true, "app": "LeafCraftPRO", "node": "v22.x", "mode": "production",
     "listening": "tcp:3000", "routes": 117, "uptime": 12 }
   ```

   If you get JSON, the Node app is alive and serving. If you get the Hostinger
   503 page instead, the app never started — **but before you chase Node**,
   confirm that static files fail too:

   ```bash
   curl -sI https://yourdomain.com/assets/css/style.css
   ```

   A `200` here with a broken `/healthz` is a Node problem (§6.1.1). A `503`
   here means the *whole account* is refusing requests, which is a resource
   limit rather than anything to do with this application (§6.1.2).
3. Check the log if it does not come up: hPanel → **Node.js** → *Logs*, or
   `~/domains/yourdomain.com/app/stderr.log`.

**The startup file must be `server.js` or `app.js`.** Hostinger's panel defaults to
`app.js` and creates a **CommonJS** stub there. This project is an ES module
(`"type": "module"`), so that stub dies instantly with
`require is not defined in ES module scope` — and LiteSpeed answers with a 503.
The repository ships its own `app.js` that simply loads the real server, so either
setting works:

```js
// app.js
import './server.js';
```

If the panel overwrote it with its stub, delete the stub and let the uploaded
`app.js` stand — or point the startup file at `server.js` instead.

### 3.4 Node mode environment variables

hPanel → **Node.js** → **Environment variables**:

| Name | Value |
|---|---|
| `SITE_URL` | `https://yourdomain.com` |
| `NODE_ENV` | `production` |

Restart the app after adding them.

> **Do not set `PORT` or `HOST` yourself.** Passenger assigns the port; hard-coding
> it is a reliable way to break the app on a shared host.

### 3.5 Do not mix the two deployment paths

If you uploaded `dist/` into `public_html` on a previous attempt, remove it before
using the Node.js app. A stale `public_html/.htaccess` from the static build will
fight Passenger's routing, and you will get 503s or 404s that look like app
failures but are not. Pick one path and clear the other.

---

## 4. Post-deploy SEO checklist

Do these once, in order. They take about fifteen minutes and they are what
actually gets the site indexed.

**1. Submit the sitemap to Google**
- [Google Search Console](https://search.google.com/search-console) → add your
  property → verify (the easiest method is a DNS TXT record via hPanel →
  **DNS Zone Editor**)
- Sitemaps → submit `https://yourdomain.com/sitemap.xml`

**2. Submit to Bing**
- [Bing Webmaster Tools](https://www.bing.com/webmasters) → add site → import
  from Google Search Console (fastest) → submit the same sitemap URL

**3. Add your verification meta tags**

Open `src/config/site.js` and fill in the block near the bottom, then rebuild:

```js
verification: {
  google: 'your-google-verification-code',
  pinterest: 'your-pinterest-domain-verify-code',
  bing: '',
},
```

**4. Turn on analytics (optional)**

Same file:

```js
analytics: {
  googleAnalyticsId: 'G-XXXXXXXXXX',   // leave '' to disable
  facebookPixelId: '',
  plausibleDomain: '',
},
```

Nothing is loaded when these are empty, so there is no tracking by default.

**5. Test the rich results**

Paste a few URLs into Google's [Rich Results Test](https://search.google.com/test/rich-results).
Every guide should report `HowTo`, `FAQ` and `Breadcrumb`; every product should
report `Product` with `AggregateRating` and `Offer`.

**6. Update the social links**

`src/config/site.js` → `social`. These are emitted in the Organization schema
`sameAs` array, the header, the footer and the share rows, so setting them once
updates the whole site. Then rebuild and re-upload.

**7. Check Core Web Vitals**

Run [PageSpeed Insights](https://pagespeed.web.dev/) on the home page, a guide
and a product page. The build is already optimised — WebP images with correct
`srcset` and `sizes`, lazy loading below the fold, `fetchpriority="high"` on
hero images, deferred JavaScript, preconnected fonts and long-lived asset
caching — so you should see strong scores without further work.

---

## 5. Changing content later

All content is plain JavaScript. Edit the file, rebuild, re-upload.

| What you want to change | File |
|---|---|
| Site name, domain, contact, social links, analytics | `src/config/site.js` |
| Blog posts (50 of them) | `src/data/posts/part-1.js` … `part-5.js` |
| Products (30 of them) | `src/data/products.js` |
| Topics and collections | `src/data/categories.js` |
| About, FAQ, policies, glossary | `src/data/pages.js` |

Then:

```bash
npm run build
node scripts/verify.js
```

…and upload the changed files from `dist/`.

**Adding a new blog post** is the most common task:

1. Pick the next free `part-N.js` file and append an object following the
   schema in `src/data/posts/_SCHEMA.md`.
2. Set `slug` to the URL you want — posts live at the root, e.g. `/my-new-guide`.
   Do **not** reuse an existing slug or a reserved path (`blog`, `shop`, `about`,
   `contact`, `faq`, `search`, `topics`, `sitemap`). The build fails loudly if
   you do, which is intentional.
3. Set `image` to the same slug.
4. Add a matching raw image at `.raw-images/raw/LCB51.png` and run
   `npm run images`, or point `image` at an existing slug to reuse its photo.

---

## 6. Troubleshooting

**Quick triage.** Before reading further, run one command:

```bash
curl -sI https://yourdomain.com/assets/css/style.css
```

`200` → the web server is fine and the problem is above it (routing, `.htaccess`,
or the Node app). `503` → the whole account is refusing requests; jump straight
to **§6.1.2**.

**The site shows a Hostinger "coming soon" page**
Something else is sitting in `public_html`. Delete `default.php`,
`index.php` or the old `index.html` and re-upload.

**`/blog` gives a 404 but `/blog/` works**
`.htaccess` is missing. Re-upload `dist/.htaccess` (or extract
`leafcraftpro-site.zip`, which contains it) and make sure your FTP client is
showing hidden files.

**The site loads but looks unstyled**
`assets/css/style.css` did not upload. Check that the whole `assets/` folder is
present in `public_html`, including `assets/img/` and `assets/js/`.

**Images are missing**
`public/images/` must be uploaded — it holds the WebP derivatives and is about
24 MB across 401 files. If you used File Manager, upload it as a zip and extract
on the server; the browser uploader struggles with that many files.

**A redirect loop after enabling HTTPS**
You turned on the HTTPS redirect before SSL finished issuing. Comment the four
redirect lines back out in `.htaccess`, wait for the certificate to become
active, then re-enable them.

**The Node app returns 503 — see §6.1 below.**

**The sitemap shows the wrong domain**
You built before setting `SITE_URL`. Fix `src/config/site.js`, rebuild, and
re-upload `sitemap.xml`, `robots.txt`, `feed.xml` and all the HTML files.

---

## 6.1 "503 Service Unavailable — the server is temporarily busy"

That exact wording — *"The server is temporarily busy, try again later!"* — is
Hostinger's edge page. **Read this first, it saves a lot of time:**

> ### The one test that tells you everything
>
> Request a **static file** that no application code is involved in:
>
> ```bash
> curl -sI https://yourdomain.com/assets/css/style.css
> ```
>
> | Result | Meaning |
> |---|---|
> | `200` — the CSS comes back | The web server **is** serving your files. The fault is specific to dynamic routes → go to **§6.1.1** |
> | `503` — same error page | **Everything** is failing, including plain files. This is **not** a Node, Passenger, `.htaccess` or code problem → go to **§6.1.2** |
>
> A code or `.htaccess` fault breaks *some* URLs. A resource-limit or
> server-level fault breaks *all* of them. This single curl distinguishes the
> two in one second.

### 6.1.1 A 503 only on dynamic routes

The web server works, but requests that would reach Node fail. In order of
likelihood:

**Cause 1 — dependencies were never installed in the application root.**
Node cannot resolve `express`, so the process exits the instant it starts.
`node_modules` must sit next to `package.json` in the application root.

```bash
source /home/USERNAME/nodevenv/domains/yourdomain.com/app/22/bin/activate
cd ~/domains/yourdomain.com/app
npm install --omit=dev
```

**Cause 2 — the startup file.** Hostinger's panel defaults the startup file to
`app.js` and writes a **CommonJS** stub there. This project is an ES module
(`"type": "module"`), so that stub dies on its first line with
`ReferenceError: require is not defined in ES module scope`.

The repository ships its own `app.js` that just loads the real server, so
either setting works:

```js
// app.js
import './server.js';
```

Set *Application startup file* to `server.js` (or `app.js`), then **Restart**.

**Cause 3 — the application root is wrong.** It must be the folder that
directly contains `package.json`, `server.js` and `app.js` side by side. A
common mistake is pointing it one level too high, so the panel looks for
`app/package.json` when the real path is `app/leafcraft-node/package.json`.

**Cause 4 — the Node version is too old.** `package.json` requires Node 18+.
Change it in hPanel → **Node.js**, then re-run `npm install` (the virtualenv
path changes with the version) and restart.

**Cause 5 — a leftover static deployment is fighting Passenger.** A stale
`public_html/.htaccess` from an earlier static upload intercepts requests
before Passenger sees them. See §3.5 — pick one deployment path and clear the
other.

### 6.1.2 A 503 on *everything*, including static files

This is **not** caused by your code, your `.htaccess`, or Passenger. Hostinger
serves this page when a hosting-plan resource limit is exceeded. From
Hostinger's own documentation:

> "When your hosting plan reaches the limit of **processes** or **RAM**, your
> website visitors may encounter the **503 Service Unavailable** error."

**Check it:** hPanel → **Websites** → **Dashboard** → **Resources Usage**.
Look at four numbers:

| Resource | What to look at |
|---|---|
| **RAM / Processes** | The #1 cause of a site-wide 503. Compare peak against the plan's ceiling. |
| **CPU** | Crossing the ceiling slows the site; it usually does not 503 on its own. |
| **Entry processes** | Concurrent requests. Long keep-alive connections each hold one. |
| **Inodes / disk** | 532 files for the static build is nothing — but check anyway. |

If a limit is pinned at 100%, that is your answer. Then:

1. **Immediately** — hPanel → **Websites** → **Dashboard** → **Boost**. This
   lifts the resource ceiling temporarily (usually ~24 h) and brings the site
   back while you fix the underlying cause. It is the fastest way to get a
   503'd site online.
2. **Then** — reduce the peak:
   - Prefer the **static** deployment (§2) over the Node app. Serving a file
     costs a fraction of what booting and running a Node process costs — on a
     shared plan this is usually the difference between fitting and not.
   - Delete anything else running on the account: old domains, staging copies,
     cron jobs, leftover Node applications, unused WordPress installs. Every one
     of them competes for the same pool.
   - Keep the `Connection close` header in `dist/.htaccess` enabled (it ships
     that way). Each keep-alive connection can occupy a worker; closing it
     immediately frees the process.
   - If peaks keep recurring, the account has outgrown the plan.

**Rule of thumb:** reaching the process or RAM limit **10–20 times in a month**
is Hostinger's own signal that the plan is too small for the workload.

### Reading the Node log

hPanel → **Node.js** → **Logs**, or over SSH:

```bash
tail -n 50 ~/domains/yourdomain.com/app/stderr.log
tail -n 50 ~/domains/yourdomain.com/app/passenger.log
```

A healthy boot prints:

```
LeafCraftPRO is running
  listening : tcp:3000
  routes    : 117
  mode      : production
  site url  : https://yourdomain.com
```

If you see that banner and the site still 503s, the app started and then
something else failed — look for an `[leafcraftpro] Uncaught exception` line
directly after it. If the log is **empty**, the app was never started at all,
which points to §6.1.1 Cause 1 or 3.

### The escape hatch — one upload, no Node

The static deployment cannot produce this 503. One zip is committed to the
repository, so you do not even need to build:

1. hPanel → **Files** → **File Manager** → open `public_html`.
2. Clear the existing contents. **Do not** leave an old `index.html` or
   `default.php` in place — it will shadow your home page.
3. Upload **`leafcraftpro-site.zip`** (26 MB) from the repository root, then
   click **Extract**. Extract it *into* `public_html`, not into a subfolder.
4. Delete the zip afterwards.
5. Turn the File Manager setting **Show hidden files** on and confirm
   `.htaccess` is present at `public_html/.htaccess`. It is inside the zip, and
   it is what makes the clean URLs work.

To rebuild the zip after changing content:

```bash
npm run build      # regenerates dist/
npm run package    # regenerates leafcraftpro-site.zip
```

Confirm it worked with `curl -sI https://yourdomain.com/assets/css/style.css`
— you want `200`.

If you want to keep the Node application too, do not — running both is the
single most confusing failure mode on this host. Pick one.

---

## 7. A note on what is deliberately not included

This build has **no database and no admin panel**, by design. That means:

- Nothing to patch, nothing to back up, nothing to go offline
- Nothing to hack — there is no login, no form handler and no session
- Orders are placed by email from the product page, so there is no payment
  processor to integrate and no card data to protect

If you later want a real cart and checkout, the natural upgrade is to keep this
static site and add a hosted commerce layer (Snipcart, Lemon Squeezy, Stripe
Payment Links) rather than rebuilding as a database-backed application. The
product pages are already marked up with full `Product` schema, so they will
slot into that without changes.
