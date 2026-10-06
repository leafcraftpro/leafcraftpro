/**
 * ============================================================
 *  View renderer.
 *  Wraps EJS so every page renders through one layout with a
 *  consistent set of helpers, and so the same code path serves
 *  both the live Express app and the static export.
 * ============================================================
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ejs from 'ejs';

import { site, relUrl, absoluteUrl } from '../config/site.js';
import {
  esc, stripTags, truncate, excerpt, formatDate, money, discountPercent,
  numberShort, blogImage, productImage, heroImage, ogImage, starsHtml, slugify,
} from './helpers.js';
import { icon } from './icons.js';
import { renderBlocks, renderArticle, extractHeadings } from './blocks.js';
import { renderMeta, renderSchema, baseNodes, breadcrumbSchema } from './seo.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VIEWS = path.resolve(__dirname, '..', 'views');

/** Helpers exposed to every template. */
export const helpers = {
  site,
  relUrl,
  absoluteUrl,
  esc,
  stripTags,
  truncate,
  excerpt,
  formatDate,
  money,
  discountPercent,
  numberShort,
  blogImage,
  productImage,
  heroImage,
  ogImage,
  starsHtml,
  slugify,
  icon,
  renderBlocks,
  renderArticle,
  extractHeadings,
  renderMeta,
  renderSchema,
  baseNodes,
  breadcrumbSchema,
};

/**
 * Pick the image most likely to be the Largest Contentful Paint element so the
 * layout can preload it. Preloading the LCP image is the single biggest lever
 * on LCP — but preloading the wrong one is worse than preloading nothing,
 * because it competes for bandwidth with whatever actually paints. So this
 * returns a value only when it can identify a real hero for the page type.
 *
 * The srcset and sizes must match the ones the <img> itself renders, or the
 * browser treats the preload as a different resource and downloads twice.
 * Every hero on this site is full-bleed (`sizes="100vw"`), which is why the
 * sizes string is a constant here.
 *
 * @param {object} data template locals (needs `manifest`)
 * @returns {{href: string, srcset: string, sizes: string}|null}
 */
function lcpImage(data = {}) {
  const m = data.manifest || {};

  const build = (group, slug) => {
    if (!slug) return null;
    const entry = (m[group] || {})[slug];
    if (!entry || !Array.isArray(entry.widths) || !entry.widths.length) return null;

    const srcset = entry.widths
      .map((w) => `${relUrl(`images/${group}/${slug}-${w}.webp`)} ${w}w`)
      .join(', ');
    const widest = entry.src || entry.widths[entry.widths.length - 1];

    return {
      href: relUrl(`images/${group}/${slug}-${widest}.webp`),
      srcset,
      sizes: '100vw',
    };
  };

  // A post page leads with its own featured image.
  if (data.post) return build('blog', data.post.image);
  // A product page leads with the first image in its gallery. Products carry
  // `images` (an array), not a single `image` field.
  if (data.product) return build('products', (data.product.images || [])[0]);
  // The home page leads with the full-bleed hero.
  if (data.current === '/') return build('hero', 'main');
  return null;
}

/**
 * The markdown twin of the current page, if it has one. The llms.txt proposal
 * recommends advertising it with rel="alternate" type="text/markdown" so
 * agents can find it without guessing at URLs.
 *
 * @param {object} data template locals
 * @returns {string|null} site-relative path, e.g. "about.md"
 */
function markdownTwin(data = {}) {
  if (data.post && data.post.slug) return `${data.post.slug}.md`;
  if (data.page && data.page.slug) return `${data.page.slug}.md`;
  if (data.current === '/') return 'index.md';
  return null;
}

/**
 * Render a view through the base layout.
 * @param {string} view  view path relative to src/views, without .ejs
 * @param {object} data  template locals
 */
export async function render(view, data = {}) {
  const viewFile = path.join(VIEWS, `${view}.ejs`);
  const layoutFile = path.join(VIEWS, 'layouts', 'base.ejs');

  const locals = {
    ...helpers,
    ...data,
    preloadImage: lcpImage(data),
    markdownTwin: markdownTwin(data),
  };

  const body = await ejs.renderFile(viewFile, locals, {
    // Templates are fully synchronous, so `include()` returns a string
    // rather than a Promise. Do NOT set `async: true` here — with it on,
    // every `<%- include(...) %>` would render as "[object Promise]".
    async: false,
    rmWhitespace: false,
  });

  return ejs.renderFile(layoutFile, { ...locals, body }, { async: false });
}

/** Render a partial to a string (used by build.js for fragments). */
export async function renderPartial(partial, data = {}) {
  const file = path.join(VIEWS, 'partials', `${partial}.ejs`);
  return ejs.renderFile(file, { ...helpers, ...data }, { async: true });
}

export default render;
