/**
 * Blog post index.
 * The posts live in five part files so they stay readable; this
 * module concatenates them into a single ordered array and adds
 * derived fields (author object, category object, reading stats).
 */

import part1 from './part-1.js';
import part2 from './part-2.js';
import part3 from './part-3.js';
import part4 from './part-4.js';
import part5 from './part-5.js';
import { getAuthor, getBlogCategory, blogCategories } from '../categories.js';

const raw = [...part1, ...part2, ...part3, ...part4, ...part5];

/** Strip HTML tags and collapse whitespace. */
export function plainText(input = '') {
  return String(input)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Rough word count across a post's intro and blocks. */
export function postWordCount(post) {
  let text = plainText(post.intro || '');
  for (const b of post.blocks || []) {
    text += ' ' + plainText(b.html || b.text || '');
    if (Array.isArray(b.items)) {
      for (const it of b.items) {
        text += ' ' + plainText(typeof it === 'string' ? it : `${it.title || ''} ${it.text || ''}`);
      }
    }
    if (Array.isArray(b.rows)) {
      for (const row of b.rows) text += ' ' + plainText(row.join(' '));
    }
  }
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Normalise every post with its resolved relations and derived data. */
function decorate(post, index) {
  const author = getAuthor(post.author || 'maya-ellis');
  const category = getBlogCategory(post.category);
  const words = postWordCount(post);

  return {
    ...post,
    index,
    authorSlug: author.slug,
    author,
    categorySlug: category ? category.slug : '',
    category,
    wordCount: words,
    // Respect an explicit readTime, otherwise derive it at ~200 wpm.
    readTime: post.readTime || Math.max(4, Math.round(words / 200)),
    // Body copy used for search, meta fallbacks and schema word counts.
    bodyText: plainText(post.intro || ''),
  };
}

export const posts = raw.map(decorate);

// ---- Ordering helpers ------------------------------------------

/** Newest first. */
export const postsByDate = [...posts].sort(
  (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
);

export const getPost = (slug) => posts.find((p) => p.slug === slug) || null;

export const getPostsByCategory = (slug) =>
  postsByDate.filter((p) => p.categorySlug === slug);

export const getPostsByAuthor = (slug) =>
  postsByDate.filter((p) => p.authorSlug === slug);

export const getFeaturedPost = () => postsByDate[0] || null;

/** Posts sharing a category, excluding the current one. */
export const getRelatedPosts = (post, limit = 4) => {
  if (!post) return [];
  const sameCategory = postsByDate.filter(
    (p) => p.slug !== post.slug && p.categorySlug === post.categorySlug
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const others = postsByDate.filter(
    (p) => p.slug !== post.slug && p.categorySlug !== post.categorySlug
  );
  return [...sameCategory, ...others].slice(0, limit);
};

/** Previous / next post in publication order. */
export const getNeighbours = (post) => {
  const idx = postsByDate.findIndex((p) => p.slug === post.slug);
  return {
    prev: idx > 0 ? postsByDate[idx - 1] : null,
    next: idx >= 0 && idx < postsByDate.length - 1 ? postsByDate[idx + 1] : null,
  };
};

/** Categories that actually have posts, with counts. */
export const categoriesWithCounts = blogCategories.map((c) => ({
  ...c,
  count: posts.filter((p) => p.categorySlug === c.slug).length,
}));

/** Tag cloud, most used first. */
export const allTags = (() => {
  const map = new Map();
  for (const p of posts) {
    for (const t of p.tags || []) map.set(t, (map.get(t) || 0) + 1);
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
})();

export default posts;
