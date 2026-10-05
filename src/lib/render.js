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
 * Render a view through the base layout.
 * @param {string} view  view path relative to src/views, without .ejs
 * @param {object} data  template locals
 */
export async function render(view, data = {}) {
  const viewFile = path.join(VIEWS, `${view}.ejs`);
  const layoutFile = path.join(VIEWS, 'layouts', 'base.ejs');

  const locals = { ...helpers, ...data };

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
