/**
 * ============================================================
 *  Block renderer.
 *  Turns the structured `blocks` array used by posts and pages
 *  into clean, semantic HTML. Every block type is handled here
 *  so the views stay readable.
 * ============================================================
 */

import { esc } from './helpers.js';
import { icon } from './icons.js';
import { relUrl } from '../config/site.js';
import manifest from '../data/manifest.js';

/** Render one inline image block that references a blog image slug. */
function renderImage(block) {
  const { src, alt = '', caption = '' } = block;
  if (!src) return '';

  // Only advertise widths that were actually generated for this image.
  const entry = (manifest.blog && manifest.blog[src]) || {};
  const widths = entry.widths && entry.widths.length ? entry.widths : [400, 640, 960];
  const srcWidth = widths.includes(640) ? 640 : widths[widths.length - 1];

  const srcset = widths
    .map((w) => `${relUrl(`images/blog/${src}-${w}.webp`)} ${w}w`)
    .join(', ');

  return `
<figure class="block-figure">
  <img src="${relUrl(`images/blog/${src}-${srcWidth}.webp`)}" srcset="${srcset}"
       sizes="(max-width: 800px) 100vw, 720px" alt="${esc(alt)}"
       width="960" height="640" loading="lazy" decoding="async">
  ${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}
</figure>`.trim();
}

const RENDERERS = {
  heading: (b) => {
    const level = Math.min(Math.max(Number(b.level) || 2, 2), 4);
    const id = String(b.text || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `<h${level} id="${id}">${esc(b.text)}</h${level}>`;
  },

  paragraph: (b) => {
    const html = String(b.html || '');
    // Content is authored by us and already contains safe markup.
    return `<div class="block-paragraph">${html}</div>`;
  },

  materials: (b) => `
<div class="block-materials">
  <h3 class="bm-title">${icon('scissors', '', 18)} ${esc(b.title || "What You'll Need")}</h3>
  <ul class="bm-list">
    ${(b.items || []).map((i) => `<li>${esc(i)}</li>`).join('\n    ')}
  </ul>
</div>`.trim(),

  steps: (b) => `
<div class="block-steps">
  ${b.title ? `<h3 class="bs-title">${esc(b.title)}</h3>` : ''}
  <ol class="bs-list">
    ${(b.items || [])
      .map(
        (s, i) => `
    <li class="bs-item">
      <span class="bs-num">${i + 1}</span>
      <div class="bs-body">
        <h4>${esc(s.title)}</h4>
        <p>${esc(s.text)}</p>
      </div>
    </li>`
      )
      .join('')}
  </ol>
</div>`.trim(),

  tips: (b) => `
<div class="block-tips">
  <h3 class="bt-title">${icon('lightbulb', '', 18)} ${esc(b.title || 'Helpful Tips')}</h3>
  <ul class="bt-list">
    ${(b.items || []).map((i) => `<li>${icon('check', '', 15)} <span>${esc(i)}</span></li>`).join('\n    ')}
  </ul>
</div>`.trim(),

  list: (b) => {
    const tag = b.ordered ? 'ol' : 'ul';
    return `<${tag} class="block-list">
    ${(b.items || []).map((i) => `<li>${esc(i)}</li>`).join('\n    ')}
</${tag}>`;
  },

  notice: (b) => {
    const tone = ['info', 'warning', 'success'].includes(b.tone) ? b.tone : 'info';
    const map = { info: 'info', warning: 'alert-triangle', success: 'check-circle' };
    return `
<div class="block-notice notice-${tone}" role="note">
  ${icon(map[tone], '', 18)}
  <p>${esc(b.text)}</p>
</div>`.trim();
  },

  quote: (b) => `
<blockquote class="block-quote">
  <p>${esc(b.text)}</p>
  ${b.cite ? `<cite>${esc(b.cite)}</cite>` : ''}
</blockquote>`.trim(),

  table: (b) => `
<div class="block-table-wrap">
  <table class="block-table">
    ${b.head ? `<thead><tr>${b.head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>` : ''}
    <tbody>
      ${(b.rows || [])
        .map((row) => `<tr>${row.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`)
        .join('\n      ')}
    </tbody>
  </table>
</div>`.trim(),

  image: renderImage,

  cta: (b) => `
<div class="block-cta">
  <div class="bc-text">
    <h3>${esc(b.title)}</h3>
    ${b.text ? `<p>${esc(b.text)}</p>` : ''}
  </div>
  ${b.buttonText ? `<a class="btn btn-lime" href="${esc(b.buttonLink || '/shop')}">${esc(b.buttonText)} ${icon('arrow-right', '', 16)}</a>` : ''}
</div>`.trim(),
};

/** Render a full blocks array to an HTML string. */
export function renderBlocks(blocks = []) {
  return blocks
    .map((block) => {
      const fn = RENDERERS[block?.type];
      if (!fn) return '';
      try {
        return fn(block);
      } catch (err) {
        console.error(`Block render failed for type "${block.type}":`, err.message);
        return '';
      }
    })
    .filter(Boolean)
    .join('\n');
}

/** Render a post's intro plus its blocks as one article body. */
export function renderArticle(post) {
  const intro = post.intro ? `<div class="article-lead">${post.intro}</div>` : '';
  return `${intro}\n${renderBlocks(post.blocks)}`;
}

/** Render product description blocks (slightly different defaults). */
export function renderProductDescription(blocks = []) {
  return renderBlocks(blocks);
}

/** Count headings so views can build a table of contents. */
export function extractHeadings(blocks = []) {
  return blocks
    .filter((b) => b.type === 'heading' && b.text)
    .map((b) => ({
      text: b.text,
      level: Number(b.level) || 2,
      id: String(b.text)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    }));
}

export default renderBlocks;
