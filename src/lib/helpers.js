/**
 * ============================================================
 *  Shared helpers — formatting, escaping, URL building and the
 *  responsive <img> / <picture> generators used by every view.
 * ============================================================
 */

import { site, relUrl, absoluteUrl } from '../config/site.js';
import manifest from '../data/manifest.js';

// ---- Escaping ---------------------------------------------------

const ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escape a value for safe insertion into HTML text or an attribute. */
export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ENTITIES[c]);
}

/** Strip tags from a string (used for meta descriptions and schema). */
export function stripTags(input = '') {
  return String(input)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Truncate to a whole word, never mid-word, with an optional ellipsis. */
export function truncate(input = '', max = 160, suffix = '…') {
  const text = String(input).trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\-–—]$/, '') + suffix;
}

/** Build an excerpt from a post's excerpt or its intro HTML. */
export function excerpt(source = '', max = 160) {
  return truncate(stripTags(source), max);
}

// ---- Dates ------------------------------------------------------

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Format an ISO date. style: 'long' | 'short' | 'iso' | 'machine' */
export function formatDate(input, style = 'long') {
  if (!input) return '';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return String(input);

  switch (style) {
    case 'short':
      return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()].slice(0, 3)} ${d.getUTCFullYear()}`;
    case 'iso':
      return d.toISOString().slice(0, 10);
    case 'machine':
      return d.toISOString();
    default:
      return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  }
}

// ---- Money ------------------------------------------------------

export function money(amount) {
  const value = Number(amount || 0);
  return `${site.currency.symbol}${value.toFixed(2)}`;
}

export function discountPercent(price, salePrice) {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

// ---- Slugs and reading ------------------------------------------

export function slugify(text = '') {
  return String(text)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}

export function readingTime(text = '') {
  const words = stripTags(text).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function numberShort(n) {
  const v = Number(n || 0);
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(v);
}

// ---- URLs -------------------------------------------------------

export { relUrl, absoluteUrl };

/** Build a canonical page URL for a route path. */
export const canonical = (path = '') => absoluteUrl(path);

// ---- Responsive images ------------------------------------------

/**
 * Build a srcset string from the widths that actually exist on disk.
 * The manifest records exactly which widths were written for each
 * image, so a small source image never produces a broken srcset entry.
 */
function buildSrcset(dir, base, fallbackWidths, available) {
  const used = available && available.length ? available : fallbackWidths;
  return used
    .map((w) => `${relUrl(`images/${dir}/${base}-${w}.webp`)} ${w}w`)
    .join(', ');
}

/** Pick the width to use for the plain `src` attribute. */
function pickSrcWidth(fallbackWidth, available) {
  if (!available || !available.length) return fallbackWidth;
  if (available.includes(fallbackWidth)) return fallbackWidth;
  return available[available.length - 1];
}

/**
 * Resolve the generated widths for an image, falling back to the
 * image manifest so call sites never have to thread it through.
 */
function resolveWidths(dir, base, explicit) {
  if (explicit && explicit.length) return explicit;
  const entry = manifest[dir] && manifest[dir][base];
  return entry && entry.widths && entry.widths.length ? entry.widths : null;
}

/** Same, for the blur-up placeholder. */
function resolveLqip(dir, base, explicit) {
  if (explicit) return explicit;
  const entry = manifest[dir] && manifest[dir][base];
  return (entry && entry.lqip) || '';
}

/**
 * Render the portrait for an author. Falls back to nothing if the author has no
 * photo in the manifest, so a new author can be added to categories.js before
 * their picture exists.
 */
export function authorImage(author, opts = {}) {
  const { className = '', width = 480, height = 480, lazy = true } = opts;
  if (!author || !author.image) return '';

  const widths = resolveWidths('authors', author.image, opts.widths);
  if (!widths || !widths.length) return '';

  const src = relUrl(`images/authors/${author.image}-${pickSrcWidth(width, widths)}.webp`);
  const srcset = buildSrcset('authors', author.image, [320, 480, 640, 960], widths);
  const cls = className ? ` class="${className}"` : '';
  const lqipResolved = resolveLqip('authors', author.image, opts.lqip);
  const style = lqipResolved
    ? ` style="background-image:url('${lqipResolved}');background-size:cover"`
    : '';
  const alt = opts.alt || author.imageAlt || `${author.name}, ${author.role}`;

  return (
    `<img src="${src}" srcset="${srcset}" sizes="(max-width: 700px) 60vw, 320px" ` +
    `alt="${esc(alt)}" width="${width}" height="${height}"${cls}${style}` +
    `${lazy ? ' loading="lazy" decoding="async"' : ' decoding="async"'}>`
  );
}

/**
 * Render a responsive <img> for a blog image.
 * Pass `widths` from the image manifest so the srcset only lists
 * files that exist.
 */
export function blogImage(slug, alt, opts = {}) {
  const {
    className = '',
    sizes = '(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 640px',
    width = 960,
    height = 640,
    lazy = true,
    fetchpriority = '',
    lqip = '',
  } = opts;

  const widths = resolveWidths('blog', slug, opts.widths);
  const lqipResolved = resolveLqip('blog', slug, lqip);
  const src = relUrl(`images/blog/${slug}-${pickSrcWidth(width, widths)}.webp`);
  const srcset = buildSrcset('blog', slug, [400, 640, 960, 1280], widths);
  const cls = className ? ` class="${className}"` : '';
  const style = lqipResolved ? ` style="background-image:url('${lqipResolved}');background-size:cover"` : '';
  const fp = fetchpriority ? ` fetchpriority="${fetchpriority}"` : '';

  return (
    `<img src="${src}" srcset="${srcset}" sizes="${sizes}" alt="${esc(alt)}" ` +
    `width="${width}" height="${height}"${cls}${style}` +
    `${lazy ? ' loading="lazy" decoding="async"' : ' decoding="async"'}${fp}>`
  );
}

/** Render a responsive <img> for a product image. */
export function productImage(slug, alt, opts = {}) {
  const {
    className = '',
    sizes = '(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 300px',
    width = 480,
    height = 480,
    lazy = true,
    fetchpriority = '',
    lqip = '',
  } = opts;

  const widths = resolveWidths('products', slug, opts.widths);
  const lqipResolved = resolveLqip('products', slug, lqip);
  const src = relUrl(`images/products/${slug}-${pickSrcWidth(width, widths)}.webp`);
  const srcset = buildSrcset('products', slug, [320, 480, 720, 1000], widths);
  const cls = className ? ` class="${className}"` : '';
  const style = lqipResolved ? ` style="background-image:url('${lqipResolved}');background-size:cover"` : '';
  const fp = fetchpriority ? ` fetchpriority="${fetchpriority}"` : '';

  return (
    `<img src="${src}" srcset="${srcset}" sizes="${sizes}" alt="${esc(alt)}" ` +
    `width="${width}" height="${height}"${cls}${style}` +
    `${lazy ? ' loading="lazy" decoding="async"' : ' decoding="async"'}${fp}>`
  );
}

/** Render a responsive hero background image. */
export function heroImage(baseName, alt, opts = {}) {
  const { className = '', width = 1280, height = 720 } = opts;
  const widths = resolveWidths('hero', baseName, opts.widths);
  const src = relUrl(`images/hero/${baseName}-${pickSrcWidth(width, widths)}.webp`);
  const srcset = buildSrcset('hero', baseName, [640, 960, 1280, 1600], widths);
  const cls = className ? ` class="${className}"` : '';
  return (
    `<img src="${src}" srcset="${srcset}" sizes="100vw" alt="${esc(alt)}" ` +
    `width="${width}" height="${height}"${cls} fetchpriority="high" decoding="async">`
  );
}

/** Absolute URL of a social share card. */
export function ogImage(baseName) {
  return absoluteUrl(`images/og/${baseName}-og.webp`);
}

// ---- Misc -------------------------------------------------------

/** Clamp a number. */
export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

/** Group an array by a key function. */
export function groupBy(list, keyFn) {
  return list.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ||= []).push(item);
    return acc;
  }, {});
}

/** Render a star rating as five stars with a fractional fill. */
export function starsHtml(rating = 0, size = 15) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let out = '<span class="stars" aria-hidden="true">';
  for (let i = 0; i < 5; i++) {
    const active = i < full || (i === full && half);
    out += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${active ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.6" class="${active ? 'on' : 'off'}"><path d="M11.53 2.53a.5.5 0 0 1 .94 0l2.1 4.9 5.3.44a.5.5 0 0 1 .28.88l-4.02 3.47 1.2 5.18a.5.5 0 0 1-.74.54L12 15.3l-4.59 2.64a.5.5 0 0 1-.74-.54l1.2-5.18-4.02-3.47a.5.5 0 0 1 .28-.88l5.3-.44Z"/></svg>`;
  }
  out += '</span>';
  return out;
}

export default {
  esc,
  stripTags,
  truncate,
  excerpt,
  formatDate,
  money,
  discountPercent,
  slugify,
  readingTime,
  numberShort,
  relUrl,
  absoluteUrl,
  canonical,
  blogImage,
  productImage,
  heroImage,
  ogImage,
  groupBy,
  starsHtml,
};
