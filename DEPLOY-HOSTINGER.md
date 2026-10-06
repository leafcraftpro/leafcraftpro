# Deploying LeafCraftPRO to Hostinger

This project is a **Node.js web application**. It runs on Hostinger's
*Setup Node.js App* feature (hPanel → **Advanced** → **Node.js**), which is
Passenger-managed Node on shared hosting.

There is no build step. You upload the project, install dependencies, and the app
renders every page on request.

---

## 0. Before you begin

**What you need**

- A Hostinger account with a plan that includes Node.js (any shared plan does)
- Your domain pointing at Hostinger (or use the free subdomain for now)
- Node.js 18 or newer on your own computer, to test locally
- This project folder

**What this project is**

117 pages, 50 in-depth craft guides, 30 products, working client-side search and
auto-generated JSON-LD schema on every page. Content lives in plain JavaScript
modules under `src/data/`. There is no database and no admin panel.

**Confirm it runs locally first.** Do not debug on the server what you can debug
on your laptop:

```bash
npm install
npm start
# then open http://localhost:3000  and  http://localhost:3000/healthz
```

Both should work before you upload anything.

---

## 1. Create the application in hPanel

1. Log in to **hPanel** → **Advanced** → **Node.js**
   (sometimes under *Website* → *Node.js*).
2. Click **Create application** and fill in:

   | Field | Value |
   |---|---|
   | Node.js version | **18, 20 or 22** — anything 18+ |
   | Application root | `domains/leafcraftpro.site/app` |
   | Application URL | `leafcraftpro.site` |
   | Application startup file | `server.js` |

3. Click **Create**.

Hostinger provisions a virtual environment for that Node version and writes stub
files into the application root.

> **Write down the application root path.** You will need the absolute form,
> which looks like `/home/u123456789/domains/leafcraftpro.site/app`. Everything
> below assumes this is the folder you upload into.

> **About the startup file.** The panel defaults to `app.js` and writes a
> **CommonJS** stub there. This project is an ES module (`"type": "module"`), so
> that stub would fail on its first line. Two ways to avoid it — and the
> repository handles both:
>
> - Set the startup file to **`server.js`** (what the table above does), or
> - Keep `app.js` as the startup file: the repository ships its own `app.js`
>   containing only `import './server.js';`, which overwrites the stub when you
>   upload.
>
> Either is fine. If you ever see `require is not defined in ES module scope` in
> the log, the panel's stub is back — delete it and re-upload `app.js`.

---

## 2. Upload the project

Upload the **entire project** into the application root. Exclude `node_modules`
(you install that on the server) and `.raw-images` (large source PNGs, not used
at runtime).

**Which files the app needs:**

```
server.js                 ← startup file
app.js                    ← entry alias
package.json
package-lock.json         ← pins exact versions; keep it
src/                      ← all routes, data, views, helpers
public/                   ← CSS, JS, images — served directly
deploy/htaccess-node.txt  ← reference only
.env.example              ← reference only
```

Everything else in the repository is documentation or development tooling and is
optional on the server.

### 2.1 Upload over SSH (recommended)

Most Hostinger plans include SSH. It is far more reliable than the browser
uploader for a project with 400+ image files.

```bash
# --- On your computer ---
cd leafcraft-node
tar --exclude=node_modules --exclude=.git --exclude=.raw-images \
    -czf ../leafcraft-app.tar.gz .

# --- On the server ---
cd ~/domains/leafcraftpro.site/app
tar -xzf ~/leafcraft-app.tar.gz
```

### 2.2 Upload via File Manager

1. hPanel → **Files** → **File Manager**.
2. Navigate to the application root (usually `domains/leafcraftpro.site/app`).
3. Zip the project locally, upload the single `.zip`, then use **Extract**.
   Uploading 400+ loose files through the browser is slow and error-prone.

Do **not** upload into `public_html` — that is the wrong folder for a Node app.
Nothing needs to be placed there; Passenger serves the domain from the
application root.

---

## 3. Install dependencies on the server

`node_modules` must be installed **on the server**, in the application root, next
to `package.json`. Never upload it from your computer — it contains
platform-specific binaries that will not run on Linux.

**Activate the virtual environment first.** The Node version in the path must
match the one you selected in step 1:

```bash
source /home/USERNAME/nodevenv/domains/leafcraftpro.site/app/22/bin/activate
```

Then install:

```bash
cd ~/domains/leafcraftpro.site/app
npm install --omit=dev
```

`--omit=dev` skips `sharp`, which is listed under `optionalDependencies` and is
used only by the offline image-generation tool. The app never imports it.

If you prefer a graphical route, hPanel → **Node.js** → your application also has
an **NPM install** button that runs this for you.

### About the build step

`package.json` defines a `build` script:

```json
"build": "echo 'Build complete'"
```

This is **intentional and does nothing**. Hostinger's deployment pipeline expects
a build script to exist and runs it after installing dependencies, so the entry is
there to satisfy that requirement. It is a no-op because this app has nothing to
compile — pages are rendered on request from `src/`, and `public/` is served
directly. There is no bundling, no transpiling and no static generation.

Do not "fix" it into something real. There is no build output to produce, and a
script that failed here would fail the whole deployment.

---

## 4. Set environment variables

hPanel → **Node.js** → **Environment variables**:

| Name | Value |
|---|---|
| `SITE_URL` | `https://leafcraftpro.site` |
| `NODE_ENV` | `production` |

`SITE_URL` is what feeds canonical URLs, Open Graph tags, the sitemap,
`robots.txt` and the RSS feed. Set it before you go live, or those will point at
the wrong domain.

> **Do not set `PORT` or `HOST`.** Passenger assigns them. `server.js` detects
> whether it was handed a TCP port or a Unix socket and binds correctly either
> way.

Click **Restart** after adding them.

---

## 5. Restart and verify

1. In hPanel → **Node.js**, click **Restart** on your application.

2. Check the health endpoint:

   ```bash
   curl -s https://leafcraftpro.site/healthz
   ```

   You want JSON back:

   ```json
   { "ok": true, "app": "LeafCraftPRO", "node": "v22.x", "mode": "production",
     "listening": "tcp:3000", "routes": 117, "uptime": 12 }
   ```

3. Walk the real pages:

   ```
   https://leafcraftpro.site/                                  → home
   https://leafcraftpro.site/blog                              → guide index
   https://leafcraftpro.site/shop                              → product index
   https://leafcraftpro.site/product/classic-palm-leaf-basket  → a product page
   https://leafcraftpro.site/sitemap.xml                       → XML sitemap
   https://leafcraftpro.site/robots.txt                        → robots file
   https://leafcraftpro.site/feed.xml                          → RSS feed
   https://leafcraftpro.site/nonexistent                       → your own 404 page
   ```

4. Enable SSL: hPanel → **Security** → **SSL** → install the free Let's Encrypt
   certificate. This usually takes a few minutes.

---

## 6. Post-deploy SEO checklist

Do these once, in order. They take about fifteen minutes and they are what
actually gets the site indexed.

**1. Submit the sitemap to Google**
- [Google Search Console](https://search.google.com/search-console) → add your
  property → verify (easiest method: a DNS TXT record via hPanel →
  **DNS Zone Editor**)
- Sitemaps → submit `https://leafcraftpro.site/sitemap.xml`

**2. Submit to Bing**
- [Bing Webmaster Tools](https://www.bing.com/webmasters) → add site → import
  from Google Search Console (fastest) → submit the same sitemap URL

**3. Add your verification meta tags**

Open `src/config/site.js` and fill in the block near the bottom:

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

Paste a few URLs into Google's
[Rich Results Test](https://search.google.com/test/rich-results). Every guide
should report `HowTo`, `FAQ` and `Breadcrumb`; every product should report
`Product` with `AggregateRating` and `Offer`.

**6. Update the social links**

`src/config/site.js` → `social`. These are emitted in the Organization schema
`sameAs` array, the header, the footer and the share rows, so setting them once
updates the whole site.

**7. Check Core Web Vitals**

Run [PageSpeed Insights](https://pagespeed.web.dev/) on the home page, a guide
and a product page.

> After any change to `src/config/site.js`, restart the app so the new values are
> picked up (hPanel → **Node.js** → **Restart**).

---

## 7. Changing content later

All content is plain JavaScript. Edit the file, then restart the app.

| What you want to change | File |
|---|---|
| Site name, domain, contact, social links, analytics | `src/config/site.js` |
| Blog posts (50 of them) | `src/data/posts/part-1.js` … `part-5.js` |
| Products (30 of them) | `src/data/products.js` |
| Topics and collections | `src/data/categories.js` |
| About, FAQ, policies, glossary | `src/data/pages.js` |
| CSS | `public/assets/css/style.css` |
| Front-end JavaScript | `public/assets/js/main.js` |

CSS and image changes under `public/` need only a file re-upload — the app serves
that folder directly, with no cache layer to invalidate.

Changes to anything under `src/` are read at startup, so **restart the app** after
editing it.

**Adding a new blog post** is the most common task:

1. Pick the next free `part-N.js` file and append an object following the schema
   in `src/data/posts/_SCHEMA.md`.
2. Set `slug` to the URL you want — posts live at the root, e.g. `/my-new-guide`.
   Do **not** reuse an existing slug or a reserved path (`blog`, `shop`, `about`,
   `contact`, `faq`, `search`, `topics`, `sitemap`).
3. Set `image` to the same slug, and add matching WebP files under
   `public/images/blog/` — or point `image` at an existing slug to reuse its
   photo.
4. Restart the app.

---

## 8. Troubleshooting

**Quick triage.** Before reading further, run one command:

```bash
curl -sI https://leafcraftpro.site/assets/css/style.css
```

`200` → the web server is fine and the problem is above it (the Node app).
`503` → the account is refusing everything; jump to **§8.2**.

### 8.1 The app returns 503, static assets return 200

The web server works but the Node process is not serving. In likelihood order:

**Cause 1 — dependencies were never installed in the application root.**
Node cannot resolve `express`, so the process exits the instant it starts.

```bash
source /home/USERNAME/nodevenv/domains/leafcraftpro.site/app/22/bin/activate
cd ~/domains/leafcraftpro.site/app
npm install --omit=dev
```

`node_modules` must sit next to `package.json`.

**Cause 2 — the startup file.** See the note in §1. Set it to `server.js`, or make
sure `app.js` is the repository's version and not the panel's CommonJS stub.

**Cause 3 — the application root is wrong.** It must be the folder that directly
contains `package.json`, `server.js` and `app.js` side by side. A common mistake
is pointing it one level too high, so the panel looks for `app/package.json` when
the real path is `app/leafcraft-node/package.json`.

**Cause 4 — the Node version is too old.** `package.json` requires Node 18+.
Change it in hPanel → **Node.js**, then re-run `npm install` (the virtualenv path
changes with the version) and restart.

**Check the log** — hPanel → **Node.js** → **Logs**, or over SSH:

```bash
tail -n 50 ~/domains/leafcraftpro.site/app/stderr.log
tail -n 50 ~/domains/leafcraftpro.site/app/passenger.log
```

A healthy boot prints:

```
LeafCraftPRO is running
  listening : tcp:3000
  routes    : 117
  mode      : production
  site url  : https://leafcraftpro.site
```

If you see that banner and the site still fails, look for an
`[leafcraftpro] Uncaught exception` line directly after it. If the log is
**empty**, the app was never started — that points at Cause 1 or 3.

### 8.2 The whole account returns 503, including static files

This is **not** caused by your code, your `.htaccess`, or Passenger. Hostinger
serves its "server is temporarily busy" page when a hosting-plan resource limit
is exceeded. From Hostinger's own documentation:

> "When your hosting plan reaches the limit of **processes** or **RAM**, your
> website visitors may encounter the **503 Service Unavailable** error."

**Check it:** hPanel → **Websites** → **Dashboard** → **Resources Usage**.
Look at RAM, processes, CPU, entry processes and inodes. If a limit is pinned at
100%, that is your answer. Then:

1. **Immediately** — hPanel → **Websites** → **Dashboard** → **Boost**. This
   lifts the resource ceiling temporarily (usually ~24 h) and brings the site
   back while you fix the underlying cause.
2. **Then** — reduce the peak: delete anything else sharing the account (other
   domains, staging copies, cron jobs, unused CMS installs), and make sure you
   are not also running a second copy of this app.
3. If peaks keep recurring, the account has outgrown the plan.

**Rule of thumb:** reaching the process or RAM limit **10–20 times in a month** is
Hostinger's own signal that the plan is too small for the workload.

### 8.3 Other symptoms

**The site shows a Hostinger "coming soon" page**
Something is sitting in `public_html` and taking precedence. Clear
`public_html` — including any hidden `.htaccess` — and let the Node application
serve the domain.

**Clean URLs 404**
If you previously deployed a static build, a stale `public_html/.htaccess` may
still be intercepting requests before Passenger sees them. Delete it.

**The site loads but looks unstyled**
`public/assets/css/style.css` did not upload. Confirm the whole `public/` folder
made it across, including `assets/img/` and `assets/js/`.

**Images are missing**
`public/images/` holds 401 WebP files. If the browser uploader struggled, upload
that folder as a zip and extract it on the server.

**Changed `src/config/site.js` but the site still shows the old domain**
The values are read at startup. Restart the app in hPanel → **Node.js**.

---

## 9. A note on what is deliberately not included

This build has **no database and no admin panel**, by design. That means:

- Nothing to patch, nothing to back up, nothing to go offline
- Nothing to hack — there is no login, no form handler and no session
- Orders are placed by email from the product page, so there is no payment
  processor to integrate and no card data to protect

If you later want a real cart and checkout, the natural upgrade is to keep this
site and add a hosted commerce layer (Snipcart, Lemon Squeezy, Stripe Payment
Links) rather than rebuilding as a database-backed application. The product pages
are already marked up with full `Product` schema, so they will slot into that
without changes.
