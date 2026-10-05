# LeafCraftPRO

A complete, SEO-optimised website for a handmade natural-craft workshop: 50
in-depth craft guides, 30 products, a working client-side search, and
auto-generated structured data on every page.

Built as a **Node.js application with a static export**. It runs either as a live
Express server or as a folder of plain HTML you upload to any host. There is no
database and no admin panel.

**Live target:** <https://leafcraftpro.site>

---

## What is in here

| | |
|---|---|
| **117 pages** | home, guide index, 50 guides, 6 topic archives, shop, 30 products, 6 collections, 2 author pages, 11 information pages, search, site map, 404 |
| **Blog URLs** | root level with no parent slug — `/how-to-make-a-palm-leaf-basket`, not `/blog/how-to-make-a-palm-leaf-basket` |
| **Images** | 81 generated photographs → 401 responsive WebP files at four widths each, plus 1200×630 social cards and inline blur-up placeholders |
| **Structured data** | `Organization`, `WebSite`, `BlogPosting`, `HowTo`, `FAQPage`, `Product` with `Offer` + `AggregateRating`, `BreadcrumbList`, `Person`, `CollectionPage`, `ItemList` |
| **SEO files** | `sitemap.xml` (115 URLs), `robots.txt`, `feed.xml`, `manifest.webmanifest`, `search-index.json` |
| **JavaScript** | zero dependencies on the front end — one 9 KB deferred file |
| **CSS** | one stylesheet, no framework, no build step |

---

## Quick start

```bash
npm install          # install build tools
npm run images       # (optional) regenerate WebP from .raw-images/
npm run build        # generate the whole site into dist/
npm run serve:dist   # preview the built site at http://localhost:4000
```

To run it as a live server instead:

```bash
npm start            # http://localhost:3000
```

---

## Commands

| Command | What it does |
|---|---|
| `npm start` | Runs the Express server (dynamic rendering) |
| `npm run build` | Renders every route to static HTML in `dist/` |
| `npm run images` | Converts `.raw-images/raw/*.png` into responsive WebP |
| `npm run serve:dist` | Serves `dist/` exactly as Apache will |
| `node scripts/verify.js` | Checks every link, image, schema block and meta tag |

**Always run `npm run build` before deploying.** Always run
`node scripts/verify.js` before uploading.

Once deployed, `GET /healthz` returns a small JSON health report — app name, Node
version, mode, listening address, route count and uptime. It is the fastest way to
tell "the app is not running" apart from "the app is running but routing is
broken".

---

## Project structure

```
leafcraft-node/
├── build.js                  # static site generator
├── server.js                 # Express server (same routes, rendered live)
├── app.js                    # entry alias — loads server.js
├── package.json
├── DEPLOY-HOSTINGER.md       # full deployment walkthrough
│
├── deploy/
│   ├── htaccess-static.txt   # Apache config copied into dist/
│   └── htaccess-node.txt     # Apache config for the Node.js app
│
├── scripts/
│   ├── optimize-images.js    # PNG → responsive WebP + LQIP + OG cards
│   ├── verify.js             # build verification
│   └── serve-dist.js         # local static preview server
│
├── src/
│   ├── config/
│   │   └── site.js           # ← the one file to edit for identity/domain
│   │
│   ├── data/
│   │   ├── posts/            # 50 guides, in five part files
│   │   │   ├── _SCHEMA.md    # the content schema
│   │   │   ├── index.js      # concatenates + decorates the posts
│   │   │   └── part-1..5.js
│   │   ├── products.js       # 30 products
│   │   ├── categories.js     # 6 topics, 6 collections, 2 authors
│   │   ├── pages.js          # about, FAQ, policies, glossary
│   │   └── manifest.js       # loads the generated image manifest
│   │
│   ├── lib/
│   │   ├── icons.js          # inline SVG icon set
│   │   ├── blocks.js         # content block → HTML renderer
│   │   ├── helpers.js        # formatting, escaping, responsive <img>
│   │   ├── seo.js            # meta tags + every JSON-LD schema builder
│   │   └── render.js         # EJS wrapper (layout + helpers)
│   │
│   ├── views/
│   │   ├── layouts/base.ejs
│   │   ├── partials/         # header, footer, cards, pagination, sidebar
│   │   └── pages/            # home, post, product, shop, topic, search…
│   │
│   └── routes.js             # the route table — every URL, with its SEO data
│
├── public/                   # copied verbatim into dist/
│   ├── assets/css/style.css
│   ├── assets/js/main.js
│   ├── assets/img/
│   └── images/               # 401 generated WebP files
│
└── dist/                     # build output — upload the CONTENTS of this
```

---

## Editing content

Everything lives in `src/data/`. No database, no CMS.

**Change site identity, domain, contact details, social links or analytics:**
`src/config/site.js`. Every one of those values flows into the pages, the
schema, the sitemap and the footer.

**Add or edit a guide:** append to `src/data/posts/part-1.js` … `part-5.js`,
following the schema documented in `src/data/posts/_SCHEMA.md`. The `slug`
becomes the URL at the root, so `slug: 'my-new-guide'` publishes at
`/my-new-guide`.

**Add or edit a product:** `src/data/products.js`.

**Add an information page:** `src/data/pages.js` — it renders through the same
block system and is automatically added to the site map and the footer.

Then rebuild:

```bash
npm run build && node scripts/verify.js
```

### Block types available in content

`heading`, `paragraph`, `materials`, `steps`, `tips`, `list`, `notice`, `quote`,
`table`, `image`, `cta`. See `_SCHEMA.md` for the exact shape of each.

---

## How the SEO works

Nothing is hand-written per page. Every tag is derived from the content.

- **Titles and descriptions** come from each item's `metaTitle` /
  `metaDescription`, falling back to a trimmed excerpt.
- **Canonicals** are built from `site.url` plus the route path.
- **Schema** is assembled into a single `@graph` per page. A guide
  automatically gets `BlogPosting`; if it contains a `steps` block it also gets
  `HowTo`; if it has an FAQ it also gets `FAQPage`.
- **Breadcrumbs** are declared once in `src/routes.js` and used for both the
  visible trail and the `BreadcrumbList` schema, so they cannot drift apart.
- **Internal linking** is generated: related guides, previous/next navigation,
  topic cross-links, and a full HTML site map.
- **The sitemap** is built from the same route table, so a new page appears in
  it automatically.

---

## Brand assets

The mark is a leaf with a gently bowed rib and three staggered vein pairs. The
veins stop short of the rib, so the join reads as an over-under weave — the two
things the workshop actually does, in one shape. It holds up from 16 px to 176 px.

| File | Use |
|---|---|
| `assets/img/logo.svg` | 512×512 tile — schema `logo`, social avatars, app icon |
| `assets/img/favicon.svg` | 64×64, heavier strokes so it survives 16 px |
| `assets/img/logo-mark.svg` | Monochrome, for light backgrounds |
| `assets/img/logo-mark-light.svg` | Monochrome white, for dark backgrounds |
| `assets/img/logo-wordmark.svg` | Horizontal lockup with the tagline |

The inline version used in the header and footer lives in `src/lib/icons.js` as
`leafmark`. Its per-path `stroke-width` values are deliberate — the outline, rib
and veins each carry a different weight so the mark does not turn to mud at
header size. Do not collapse them to one value.

To swap the mark, update the path data in `icons.js` **and** the five SVG files
together, or the header and the social cards will disagree.

---

## Performance notes

- Images are served as WebP at four widths with `srcset` and `sizes`, so a
  phone downloads roughly 20–40 KB per card instead of a 150 KB original.
- Every image carries a 20 px inline blur-up placeholder as a data URI — no
  extra request, no layout shift.
- Hero images use `fetchpriority="high"` and no lazy loading; everything below
  the fold is `loading="lazy" decoding="async"`.
- Fonts are preconnected and loaded non-render-blocking, with a `noscript`
  fallback.
- JavaScript is a single deferred file and the site is fully usable without it.
- Apache handles GZIP and one-year immutable caching for static assets.

---

## Accessibility

Semantic landmarks, a skip link, visible focus rings, full keyboard support
(including the mobile menu, search overlay and product gallery), `aria-*` state
on every interactive control, AA contrast, 44 px minimum touch targets, and
respect for `prefers-reduced-motion`. See `/accessibility` on the built site.

---

## Deployment

See **[DEPLOY-HOSTINGER.md](DEPLOY-HOSTINGER.md)** for the complete walkthrough,
covering both the static upload and the Node.js app paths, plus the post-deploy
SEO checklist and troubleshooting.

The short version for the static path:

```bash
npm run build
# upload the CONTENTS of dist/ to public_html
# make sure .htaccess comes across (it is a hidden file)
```

---

## Licence

All tutorial text, photographs and product designs are © LeafCraftPRO.
The code may be reused; the content may not be republished without permission.
