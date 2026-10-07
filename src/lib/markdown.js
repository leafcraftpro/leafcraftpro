/**
 * ============================================================
 *  Markdown output for language models.
 *
 *  Produces the files described by the llms.txt proposal
 *  (https://llmstxt.org):
 *
 *    /llms.txt        curated index — H1, blockquote summary,
 *                     H2 sections of links, Optional section
 *    /llms-full.txt   every guide in full, for agents that want
 *                     the whole corpus in one fetch
 *    /<page>.md       a clean markdown twin of each HTML page,
 *                     at the same URL with the extension changed
 *
 *  The HTML pages stay as they are; these are additive. Pages
 *  advertise their markdown twin with
 *  rel="alternate" type="text/markdown", and llms.txt with
 *  rel="describedby", both of which the proposal recommends so
 *  agents can discover them without guessing URLs.
 * ============================================================
 */

import { site, absoluteUrl } from '../config/site.js';
import { postsByDate, plainText } from '../data/posts/index.js';

/** Content HTML only ever uses <p>, but be tolerant of inline tags anyway. */
function htmlToText(html = '') {
  return String(html)
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Collapse a string to one line, for use inside list items. */
const oneLine = (s) => htmlToText(s).replace(/\n+/g, ' ').trim();

/** Render one content block as markdown. */
function blockToMarkdown(block) {
  switch (block.type) {
    case 'heading':
      return `${'#'.repeat(Math.min(Math.max(block.level || 2, 2), 6))} ${block.text}`;

    case 'paragraph':
      return htmlToText(block.html || block.text);

    case 'materials':
      return [
        `**${block.title || 'Materials'}**`,
        '',
        ...(block.items || []).map((i) => `- ${oneLine(i)}`),
      ].join('\n');

    case 'steps':
      return [
        `**${block.title || 'Steps'}**`,
        '',
        ...(block.items || []).map(
          (s, i) => `${i + 1}. **${oneLine(s.title || '')}** — ${oneLine(s.text || '')}`
        ),
      ].join('\n');

    case 'tips':
      return [
        `**${block.title || 'Tips'}**`,
        '',
        ...(block.items || []).map((i) => `- ${oneLine(i)}`),
      ].join('\n');

    case 'list':
      return (block.items || [])
        .map((i, n) => (block.ordered ? `${n + 1}. ${oneLine(i)}` : `- ${oneLine(i)}`))
        .join('\n');

    case 'notice':
      return `> ${oneLine(block.text)}`;

    case 'quote':
      return block.cite
        ? `> ${oneLine(block.text)}\n>\n> — ${oneLine(block.cite)}`
        : `> ${oneLine(block.text)}`;

    case 'table': {
      const head = block.head || [];
      const rows = block.rows || [];
      if (!head.length) return '';
      return [
        `| ${head.join(' | ')} |`,
        `| ${head.map(() => '---').join(' | ')} |`,
        ...rows.map((r) => `| ${r.join(' | ')} |`),
      ].join('\n');
    }

    case 'image':
      return block.caption
        ? `![${oneLine(block.alt || '')}](${absoluteUrl(`images/blog/${block.src}-1280.webp`)})\n\n*${oneLine(block.caption)}*`
        : `![${oneLine(block.alt || '')}](${absoluteUrl(`images/blog/${block.src}-1280.webp`)})`;

    case 'cta':
      return `**${block.title || ''}** ${oneLine(block.text || '')}\n\n[${block.buttonText || 'Learn more'}](${absoluteUrl((block.buttonLink || '/shop').replace(/^\//, ''))})`;

    default:
      return '';
  }
}

/** Full markdown for one blog post. */
export function postToMarkdown(post) {
  const lines = [
    `# ${post.title}`,
    '',
    `> ${post.excerpt}`,
    '',
    `Source: ${absoluteUrl(post.slug)}`,
    `Published: ${post.publishedAt} · ${post.readTime} min read · ${post.difficulty} · ${post.category ? post.category.name : ''}`,
    '',
  ];

  const intro = htmlToText(post.intro);
  if (intro) lines.push(intro, '');

  for (const block of post.blocks || []) {
    const md = blockToMarkdown(block);
    if (md) lines.push(md, '');
  }

  if (Array.isArray(post.faq) && post.faq.length) {
    lines.push('## Frequently asked questions', '');
    for (const f of post.faq) {
      lines.push(`### ${oneLine(f.q)}`, '', oneLine(f.a), '');
    }
  }

  lines.push('---', '', `© ${site.name} — ${absoluteUrl('')}`, '');
  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

/** Full markdown for one information page (about, FAQ, policies, glossary). */
export function pageToMarkdown(page) {
  const lines = [
    `# ${page.title}`,
    '',
    `Source: ${absoluteUrl(page.slug)}`,
    '',
  ];
  if (page.intro) lines.push(htmlToText(page.intro), '');
  for (const block of page.blocks || []) {
    const md = blockToMarkdown(block);
    if (md) lines.push(md, '');
  }
  lines.push('---', '', `© ${site.name} — ${absoluteUrl('')}`, '');
  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

/** The guide index as markdown, grouped by topic. */
export function blogIndexToMarkdown() {
  const lines = [
    '# Craft guides',
    '',
    `> Every tutorial on ${site.name}, newest first.`,
    '',
    `Source: ${absoluteUrl('blog')}`,
    '',
    `${postsByDate.length} step-by-step guides for weaving baskets, homeware and small gifts from palm and coconut leaves. Each one lists its materials, its real timings and the parts that are fiddly.`,
    '',
  ];

  const byCategory = new Map();
  for (const post of postsByDate) {
    const name = post.category ? post.category.name : 'Other';
    if (!byCategory.has(name)) byCategory.set(name, []);
    byCategory.get(name).push(post);
  }

  for (const [name, posts] of byCategory) {
    lines.push(`## ${name}`, '');
    for (const p of posts) {
      lines.push(`- [${p.title}](${absoluteUrl(`${p.slug}.md`)}): ${oneLine(p.excerpt)}`);
    }
    lines.push('');
  }

  lines.push('---', '', `© ${site.name} — ${absoluteUrl('')}`, '');
  return lines.join('\n');
}

/** The shop index as markdown. */
export function shopIndexToMarkdown(products) {
  const lines = [
    '# Shop',
    '',
    `> Finished handmade pieces from ${site.name}, ready to use or give.`,
    '',
    `Source: ${absoluteUrl('shop')}`,
    '',
    'Every piece is made by hand from natural palm and coconut leaf. Prices are in US dollars; orders are placed by email from each product page.',
    '',
  ];

  for (const p of products) {
    const price =
      p.salePrice != null ? `${p.salePrice} USD (was ${p.price} USD)` : `${p.price} USD`;
    lines.push(
      `- [${p.name}](${absoluteUrl(`product/${p.slug}`)}): ${price}. ${oneLine(p.shortDescription || '')}`
    );
  }

  lines.push('', '---', '', `© ${site.name} — ${absoluteUrl('')}`, '');
  return lines.join('\n');
}

/** The home page as markdown. */
export function homeToMarkdown() {
  const latest = postsByDate.slice(0, 10);
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.shortDescription}`,
    '',
    `Source: ${absoluteUrl('')}`,
    '',
    `${site.name} publishes free, hand-tested tutorials for weaving baskets, homeware and small gifts from palm and coconut leaves. Every guide is made by hand before it is written up, and each one gives real timings, the fiddly parts and how to rescue a step that has gone wrong.`,
    '',
    `${postsByDate.length} guides and a small shop of finished pieces. No accounts, no cookies, no tracking.`,
    '',
    '## Latest guides',
    '',
    ...latest.map(
      (p) => `- [${p.title}](${absoluteUrl(`${p.slug}.md`)}): ${oneLine(p.excerpt)}`
    ),
    '',
    '## Browse',
    '',
    `- [All guides](${absoluteUrl('blog.md')}): every tutorial, grouped by topic`,
    `- [Shop](${absoluteUrl('shop.md')}): finished baskets, homeware and gifts`,
    `- [About](${absoluteUrl('about.md')}): who makes the pieces and how guides are tested`,
    `- [FAQ](${absoluteUrl('faq.md')}): materials, delivery, care and returns`,
    '',
    '---',
    '',
    `© ${site.name} — ${absoluteUrl('')}`,
    '',
  ];
  return lines.join('\n');
}

/** The curated index, following the llms.txt v2 format. */
export function buildLlmsTxt() {
  const latest = postsByDate.slice(0, 8);

  const postLine = (p) =>
    `- [${p.title}](${absoluteUrl(`${p.slug}.md`)}): ${oneLine(p.excerpt)}`;

  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.shortDescription}`,
    '',
    `${site.name} publishes free, hand-tested tutorials for weaving baskets, homeware and small gifts from palm and coconut leaves. Everything here is made by hand before it is written up, and every guide lists the real timings, the fiddly parts and how to rescue a step that has gone wrong.`,
    '',
    'The site is entirely static and has no accounts, no cookies and no tracking. Prices are shown in US dollars and orders are placed by email from the product page.',
    '',
    'Every page below has a markdown twin at the same URL with `.md` in place of `.html`, which is what these links point to.',
    '',
    '## Start here',
    '',
    `- [All craft guides](${absoluteUrl('blog.md')}): the full index of tutorials, newest first`,
    `- [Shop](${absoluteUrl('shop.md')}): finished baskets, homeware and gifts`,
    `- [About ${site.name}](${absoluteUrl('about.md')}): who makes the pieces and how the guides are tested`,
    `- [Frequently asked questions](${absoluteUrl('faq.md')}): materials, delivery, care and returns`,
    `- [Craft glossary](${absoluteUrl('craft-glossary.md')}): weaving terms explained in plain language`,
    '',
    '## Latest guides',
    '',
    ...latest.map(postLine),
    '',
    '## Weaving fundamentals',
    '',
    `- [How to weave a basket base](${absoluteUrl('how-to-weave-a-basket-base.md')}): square, round and oval starts, and which to choose`,
    `- [Basket weaving tools](${absoluteUrl('basket-weaving-tools.md')}): the short list of tools that actually earn their place`,
    `- [Common leaf weaving mistakes](${absoluteUrl('beginner-weaving-mistakes.md')}): the seven errors that ruin a first basket`,
    `- [How to make a palm leaf basket](${absoluteUrl('how-to-make-a-palm-leaf-basket.md')}): the complete beginner project`,
    `- [How to prepare palm leaves](${absoluteUrl('how-to-prepare-palm-leaves.md')}): harvesting, soaking and storing`,
    `- [How to weave a basket lid that fits](${absoluteUrl('how-to-weave-a-basket-lid.md')}): sizing the lip so it rests on the rim instead of falling through`,
    `- [How to weave a small egg basket](${absoluteUrl('woven-egg-basket.md')}): a round basket with a handle woven into the rim`,
    '',
    '## Projects by item',
    '',
    `- [Palm leaf bowl](${absoluteUrl('how-to-make-a-palm-leaf-bowl.md')}): a shallow bowl, and how to flare the walls evenly`,
    `- [Palm leaf magazine holder](${absoluteUrl('palm-leaf-magazine-holder.md')}): a tall holder built on a rigid frame`,
    `- [Palm leaf tissue box cover](${absoluteUrl('palm-leaf-tissue-box-cover.md')}): ninety minutes, with a slot that will not tear the tissue`,
    `- [Woven trivet](${absoluteUrl('woven-trivet-tutorial.md')}): a forty-minute project that actually insulates`,
    `- [Woven wall pocket](${absoluteUrl('woven-wall-pocket.md')}): flat-backed, hangs from a single hook`,
    `- [Palm leaf candle holder](${absoluteUrl('palm-leaf-candle-holder.md')}): a woven sleeve around a metal cup, designed so the flame stays clear`,
    `- [Coconut leaf dragonfly](${absoluteUrl('coconut-leaf-dragonfly.md')}): four creased wings from a single leaflet`,
    `- [Coconut leaf crown](${absoluteUrl('coconut-leaf-crown.md')}): interlocking points that fit any head size`,
    `- [Coconut leaf wind chime](${absoluteUrl('coconut-leaf-wind-chime.md')}): leaf shapes and wooden beads, tuned for a soft clack`,
    '',
    '## Crafts with children',
    '',
    `- [Palm leaf hand puppet](${absoluteUrl('palm-leaf-puppet.md')}): one fold, no glue, works from about age five`,
    `- [Leaf suncatchers](${absoluteUrl('leaf-suncatcher-craft.md')}): pressed leaves in a card frame, from about age three`,
    '',
    '## Materials and sustainability',
    '',
    `- [Sustainable crafting guide](${absoluteUrl('sustainable-crafting-guide.md')}): choosing fibres with a lower impact`,
    `- [Benefits of natural materials](${absoluteUrl('benefits-of-natural-materials.md')}): why leaf and fibre outlast plastic`,
    `- [Composting natural crafts](${absoluteUrl('composting-natural-crafts.md')}): what happens when a piece goes back to the earth`,
    `- [How to care for woven crafts](${absoluteUrl('how-to-care-for-woven-crafts.md')}): cleaning, drying and reshaping`,
    `- [Natural dye for leaf crafts](${absoluteUrl('natural-dye-for-leaf-crafts.md')}): which plant dyes actually hold on leaf, tested over a season`,
    `- [Setting up a zero-waste craft room](${absoluteUrl('zero-waste-craft-room.md')}): sorting offcuts by length so nothing is thrown away`,
    '',
    '## Shopping and policies',
    '',
    `- [Shipping and returns](${absoluteUrl('shipping-returns.md')}): delivery times, costs and the returns window`,
    `- [Privacy policy](${absoluteUrl('privacy-policy.md')}): what is collected, which is nothing beyond server logs`,
    `- [Terms](${absoluteUrl('terms.md')}): the terms that apply to orders and to reusing the tutorials`,
    `- [Accessibility](${absoluteUrl('accessibility.md')}): how the site is built to be usable by everyone`,
    '',
    '## Optional',
    '',
    `- [Full corpus](${absoluteUrl('llms-full.txt')}): every guide in full in a single file — large, fetch only if you need everything`,
    `- [Sitemap](${absoluteUrl('sitemap.xml')}): machine-readable list of all indexable pages`,
    `- [RSS feed](${absoluteUrl('feed.xml')}): the 30 most recent guides, for feed readers`,
    '',
  ];

  return lines.join('\n');
}

/** Every guide in full, in one file. */
export function buildLlmsFullTxt() {
  const parts = [
    `# ${site.name} — full corpus`,
    '',
    `> Every guide on ${site.name} in a single markdown file.`,
    '',
    `Generated from the same content the website renders. For a curated index instead, see ${absoluteUrl('llms.txt')}.`,
    '',
  ];

  for (const post of postsByDate) {
    parts.push('', '---', '', postToMarkdown(post));
  }

  return parts.join('\n');
}
