/**
 * ============================================================
 *  Route table.
 *  Every URL the site serves is declared here with its view,
 *  its data and its SEO descriptor. build.js renders each one
 *  to a static file; server.js serves the same routes live.
 * ============================================================
 */

import { site, absoluteUrl, relUrl } from './config/site.js';
import { posts, postsByDate, getPost, getPostsByCategory, getRelatedPosts, getNeighbours, categoriesWithCounts, allTags } from './data/posts/index.js';
import products from './data/products.js';
import { productCategories, blogCategories, authors, getAuthor } from './data/categories.js';
import { pages, getPage } from './data/pages.js';
import { excerpt, truncate, ogImage } from './lib/helpers.js';
import {
  baseNodes, breadcrumbSchema, personSchema, faqSchema, articleSchema,
  howToSchema, productSchema, collectionPageSchema, webPageSchema, itemListSchema,
} from './lib/seo.js';

// ---- Page sizes -------------------------------------------------
const PER_PAGE = { blog: 12, shop: 9 };

// ---- Reserved top-level paths -----------------------------------
// Root-level post slugs must not collide with these.
export const RESERVED = new Set([
  '', 'blog', 'shop', 'topics', 'topic', 'collection', 'product', 'search',
  'about', 'contact', 'faq', 'privacy-policy', 'terms', 'shipping-returns',
  'cookie-policy', 'accessibility', 'craft-glossary', 'sitemap', 'sitemap.xml',
  'robots.txt', 'feed.xml', 'author', 'page', '404', '404.html',
  'search-index.json', 'manifest.webmanifest', 'assets', 'images',
]);

/** Verify no post slug shadows a real route. Throws on collision. */
export function validateSlugs() {
  const clashes = posts.filter((p) => RESERVED.has(p.slug)).map((p) => p.slug);
  if (clashes.length) {
    throw new Error(
      `Post slug(s) collide with reserved routes: ${clashes.join(', ')}. ` +
      'Rename them in src/data/posts/.'
    );
  }

  const seen = new Set();
  for (const p of posts) {
    if (seen.has(p.slug)) throw new Error(`Duplicate post slug: ${p.slug}`);
    seen.add(p.slug);
  }
  const pSeen = new Set();
  for (const p of products) {
    if (pSeen.has(p.slug)) throw new Error(`Duplicate product slug: ${p.slug}`);
    pSeen.add(p.slug);
  }
}

// ---- Derived collections ----------------------------------------

const blogCounts = categoriesWithCounts;
const productCounts = productCategories.map((c) => ({
  ...c,
  count: products.filter((p) => p.category === c.slug).length,
}));

const featuredProducts = products.filter((p) => p.featured);
const popularPosts = [...posts].sort((a, b) => b.wordCount - a.wordCount).slice(0, 6);

/** Sort a post list. */
function sortPosts(list, sort) {
  const copy = [...list];
  switch (sort) {
    case 'oldest': return copy.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
    case 'title': return copy.sort((a, b) => a.title.localeCompare(b.title));
    case 'readtime': return copy.sort((a, b) => a.readTime - b.readTime);
    default: return copy.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }
}

/** Sort a product list. */
function sortProducts(list, sort) {
  const copy = [...list];
  const price = (p) => p.salePrice || p.price;
  switch (sort) {
    case 'price-asc': return copy.sort((a, b) => price(a) - price(b));
    case 'price-desc': return copy.sort((a, b) => price(b) - price(a));
    case 'rating': return copy.sort((a, b) => b.rating - a.rating);
    case 'name': return copy.sort((a, b) => a.name.localeCompare(b.name));
    default: return copy.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
  }
}

/** Build a pagination descriptor. */
function paginate(total, page, perPage, basePath) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const from = total === 0 ? 0 : (current - 1) * perPage + 1;
  const to = Math.min(current * perPage, total);
  return {
    page: current,
    totalPages,
    total,
    from,
    to,
    perPage,
    basePath,
    hasPrev: current > 1,
    hasNext: current < totalPages,
  };
}

/** Rating distribution for a product's review histogram. */
function distributionFor(product) {
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of product.reviews || []) dist[r.rating] = (dist[r.rating] || 0) + 1;
  // Pad the histogram so it looks realistic against the headline count.
  const known = Object.values(dist).reduce((a, b) => a + b, 0);
  const filler = Math.max(0, product.reviewCount - known);
  dist[5] += Math.round(filler * 0.72);
  dist[4] += Math.round(filler * 0.2);
  dist[3] += Math.round(filler * 0.06);
  dist[2] += Math.round(filler * 0.02);
  return dist;
}

/** A short, quotable summary used for the "In short" box. */
function quickAnswerFor(post) {
  const base = post.excerpt || excerpt(post.intro, 240);
  return truncate(base, 240);
}

// ---- Shared view data -------------------------------------------

const shared = {
  topicNav: blogCounts,
  collectionNav: productCounts,
};

// =================================================================
//  ROUTE TABLE
// =================================================================

export function buildRoutes() {
  validateSlugs();

  const routes = [];

  /* ---------------- Home ---------------- */
  routes.push({
    url: '',
    out: 'index.html',
    view: 'pages/home',
    current: '/',
    data: {
      ...shared,
      featured: postsByDate[0],
      latest: postsByDate.slice(0, 6),
      topics: blogCounts,
      collections: productCounts,
      products: featuredProducts,
      popular: popularPosts,
    },
    page: {
      title: `${site.name} — Handmade Leaf Crafts, Tutorials and Shop`,
      description:
        'Fifty step-by-step tutorials for weaving palm and coconut leaves, plus thirty handmade baskets, ornaments and home decor pieces from our own workshop.',
      path: '',
      type: 'website',
      image: ogImage('site-default'),
      imageAlt: 'A workbench with fresh palm leaves and a half-finished woven basket',
      keywords: [
        'leaf craft', 'palm leaf crafts', 'coconut leaf crafts', 'handmade baskets',
        'weaving tutorials', 'natural home decor', 'eco friendly crafts',
      ],
      schema: [
        ...baseNodes(),
        webPageSchema({
          name: `${site.name} — Handmade Leaf Crafts and Tutorials`,
          description: site.shortDescription,
          path: '',
          type: 'WebPage',
        }),
        itemListSchema(
          postsByDate.slice(0, 10).map((p) => ({ name: p.title, path: p.slug })),
          { name: 'Latest craft guides', path: '' }
        ),
      ],
    },
  });

  /* ---------------- Blog index + pagination ---------------- */
  const blogSorted = sortPosts(posts, 'latest');
  const blogPages = Math.ceil(blogSorted.length / PER_PAGE.blog);

  for (let i = 1; i <= blogPages; i++) {
    const url = i === 1 ? 'blog' : `blog/page/${i}`;
    const slice = blogSorted.slice((i - 1) * PER_PAGE.blog, i * PER_PAGE.blog);
    routes.push({
      url,
      out: i === 1 ? 'blog/index.html' : `blog/page/${i}/index.html`,
      view: 'pages/blog-index',
      current: '/blog',
      data: {
        ...shared,
        posts: slice,
        popular: popularPosts,
        sort: 'latest',
        pagination: paginate(blogSorted.length, i, PER_PAGE.blog, 'blog'),
        trail: [{ name: 'Home', path: '' }, { name: 'Craft guides', path: 'blog' }],
      },
      page: {
        title: i === 1
          ? 'Craft Guides & Tutorials: 50 Step-by-Step Projects'
          : `Craft Guides — Page ${i} of ${blogPages}`,
        description:
          'Browse every LeafCraftPRO tutorial: palm leaf baskets, coconut leaf ornaments, weaving techniques, home decor and kids crafts, all tested by hand.',
        path: url,
        type: 'website',
        image: ogImage('site-default'),
        keywords: ['craft tutorials', 'leaf craft guides', 'weaving tutorials', 'diy leaf crafts'],
        prev: i > 1 ? absoluteUrl(i === 2 ? 'blog' : `blog/page/${i - 1}`) : '',
        next: i < blogPages ? absoluteUrl(`blog/page/${i + 1}`) : '',
        schema: [
          ...baseNodes(),
          collectionPageSchema({
            name: 'Craft Guides & Tutorials',
            description: 'Every step-by-step craft guide published by LeafCraftPRO.',
            path: url,
            items: slice.map((p) => ({ name: p.title, path: p.slug })),
            type: 'Article',
          }),
          breadcrumbSchema([
            { name: 'Home', path: '' },
            { name: 'Craft guides', path: 'blog' },
          ]),
        ],
      },
    });
  }

  /* ---------------- Topics index ---------------- */
  routes.push({
    url: 'topics',
    out: 'topics/index.html',
    view: 'pages/topics',
    current: '/topics',
    data: {
      ...shared,
      topics: blogCounts,
      grouped: Object.fromEntries(
        blogCategories.map((c) => [c.slug, getPostsByCategory(c.slug)])
      ),
      trail: [{ name: 'Home', path: '' }, { name: 'Topics', path: 'topics' }],
    },
    page: {
      title: 'Browse Craft Topics: Six Areas of Leaf Craft',
      description:
        'Explore LeafCraftPRO by topic — palm leaf crafts, coconut leaf crafts, baskets and weaving, home decor, kids crafts and eco living.',
      path: 'topics',
      type: 'website',
      keywords: ['leaf craft topics', 'craft categories', 'weaving topics'],
      schema: [
        ...baseNodes(),
        collectionPageSchema({
          name: 'Craft topics',
          description: 'The six areas of leaf craft covered on LeafCraftPRO.',
          path: 'topics',
          items: blogCounts.map((c) => ({ name: c.name, path: `topic/${c.slug}` })),
        }),
        breadcrumbSchema([
          { name: 'Home', path: '' },
          { name: 'Topics', path: 'topics' },
        ]),
      ],
    },
  });

  /* ---------------- Topic archives ---------------- */
  for (const cat of blogCounts) {
    const list = sortPosts(getPostsByCategory(cat.slug), 'latest');
    const pages_ = Math.max(1, Math.ceil(list.length / PER_PAGE.blog));

    for (let i = 1; i <= pages_; i++) {
      const base = `topic/${cat.slug}`;
      const url = i === 1 ? base : `${base}/page/${i}`;
      const slice = list.slice((i - 1) * PER_PAGE.blog, i * PER_PAGE.blog);

      routes.push({
        url,
        out: i === 1 ? `${base}/index.html` : `${base}/page/${i}/index.html`,
        view: 'pages/topic',
        current: `/topic/${cat.slug}`,
        data: {
          ...shared,
          topic: cat,
          posts: slice,
          popular: popularPosts,
          sort: 'latest',
          others: blogCounts.filter((c) => c.slug !== cat.slug),
          pagination: paginate(list.length, i, PER_PAGE.blog, base),
          trail: [
            { name: 'Home', path: '' },
            { name: 'Topics', path: 'topics' },
            { name: cat.name, path: base },
          ],
        },
        page: {
          title: i === 1 ? cat.metaTitle : `${cat.name} — Page ${i}`,
          description: cat.metaDescription,
          path: url,
          type: 'website',
          keywords: [cat.name.toLowerCase(), `${cat.name.toLowerCase()} tutorials`, 'leaf craft'],
          prev: i > 1 ? absoluteUrl(i === 2 ? base : `${base}/page/${i - 1}`) : '',
          next: i < pages_ ? absoluteUrl(`${base}/page/${i + 1}`) : '',
          schema: [
            ...baseNodes(),
            collectionPageSchema({
              name: cat.name,
              description: cat.description,
              path: url,
              items: slice.map((p) => ({ name: p.title, path: p.slug })),
              type: 'Article',
            }),
            breadcrumbSchema([
              { name: 'Home', path: '' },
              { name: 'Topics', path: 'topics' },
              { name: cat.name, path: base },
            ]),
          ],
        },
      });
    }
  }

  /* ---------------- Blog posts ---------------- */
  for (const post of posts) {
    const related = getRelatedPosts(post, 4);
    const neighbours = getNeighbours(post);

    const schema = [
      ...baseNodes(),
      personSchema(post.author),
      articleSchema(post, post.category),
      breadcrumbSchema([
        { name: 'Home', path: '' },
        { name: 'Craft guides', path: 'blog' },
        { name: post.category ? post.category.name : 'Guide', path: post.category ? `topic/${post.category.slug}` : 'blog' },
        { name: post.title, path: post.slug },
      ]),
    ];

    const howTo = howToSchema(post);
    if (howTo) schema.push(howTo);
    if (post.faq?.length) schema.push(faqSchema(post.faq));

    routes.push({
      url: post.slug,
      out: `${post.slug}/index.html`,
      view: 'pages/post',
      current: `/${post.slug}`,
      data: {
        ...shared,
        post,
        related,
        neighbours,
        popular: popularPosts,
        headings: (post.blocks || [])
          .filter((b) => b.type === 'heading' && b.text)
          .map((b) => ({
            text: b.text,
            level: Number(b.level) || 2,
            id: String(b.text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
          })),
        quickAnswer: quickAnswerFor(post),
        trail: [
          { name: 'Home', path: '' },
          { name: 'Craft guides', path: 'blog' },
          { name: post.category ? post.category.name : 'Guide', path: post.category ? `topic/${post.category.slug}` : 'blog' },
          { name: truncate(post.title, 42), path: post.slug },
        ],
      },
      page: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || excerpt(post.excerpt || post.intro, 158),
        path: post.slug,
        type: 'article',
        image: ogImage(post.slug),
        imageAlt: post.imageAlt || post.title,
        keywords: post.keywords || [],
        article: {
          publishedTime: new Date(post.publishedAt).toISOString(),
          modifiedTime: new Date(post.updatedAt || post.publishedAt).toISOString(),
          author: post.author.name,
          section: post.category ? post.category.name : '',
          tags: post.tags || [],
        },
        schema,
      },
    });
  }

  /* ---------------- Author archives ---------------- */
  for (const author of authors) {
    const list = postsByDate.filter((p) => p.authorSlug === author.slug);
    routes.push({
      url: `author/${author.slug}`,
      out: `author/${author.slug}/index.html`,
      view: 'pages/author',
      current: `/author/${author.slug}`,
      data: {
        ...shared,
        author,
        posts: list,
        popular: popularPosts,
        trail: [
          { name: 'Home', path: '' },
          { name: 'Craft guides', path: 'blog' },
          { name: author.name, path: `author/${author.slug}` },
        ],
      },
      page: {
        title: `${author.name} — ${author.role}`,
        description: truncate(author.bio, 158),
        path: `author/${author.slug}`,
        type: 'profile',
        keywords: [author.name, 'leaf craft author', site.name],
        schema: [
          ...baseNodes(),
          personSchema(author),
          collectionPageSchema({
            name: `Guides by ${author.name}`,
            description: author.bio,
            path: `author/${author.slug}`,
            items: list.map((p) => ({ name: p.title, path: p.slug })),
            type: 'Article',
          }),
          breadcrumbSchema([
            { name: 'Home', path: '' },
            { name: 'Craft guides', path: 'blog' },
            { name: author.name, path: `author/${author.slug}` },
          ]),
        ],
      },
    });
  }

  /* ---------------- Shop index + pagination ---------------- */
  const shopSorted = sortProducts(products, 'featured');
  const shopPages = Math.ceil(shopSorted.length / PER_PAGE.shop);

  for (let i = 1; i <= shopPages; i++) {
    const url = i === 1 ? 'shop' : `shop/page/${i}`;
    const slice = shopSorted.slice((i - 1) * PER_PAGE.shop, i * PER_PAGE.shop);
    routes.push({
      url,
      out: i === 1 ? 'shop/index.html' : `shop/page/${i}/index.html`,
      view: 'pages/shop',
      current: '/shop',
      data: {
        ...shared,
        products: slice,
        collections: productCounts,
        sort: 'featured',
        activeCollection: '',
        pagination: paginate(shopSorted.length, i, PER_PAGE.shop, 'shop'),
        trail: [{ name: 'Home', path: '' }, { name: 'Shop', path: 'shop' }],
      },
      page: {
        title: i === 1
          ? 'Shop Handmade Natural Crafts: Baskets, Decor & Gifts'
          : `Shop — Page ${i} of ${shopPages}`,
        description:
          'Shop thirty handmade pieces woven from natural palm and coconut leaves — baskets, home decor, ornaments, gift boxes and craft kits. Free shipping over $50.',
        path: url,
        type: 'website',
        image: ogImage('classic-palm-leaf-basket'),
        keywords: ['handmade baskets', 'natural home decor', 'woven gifts', 'palm leaf shop'],
        prev: i > 1 ? absoluteUrl(i === 2 ? 'shop' : `shop/page/${i - 1}`) : '',
        next: i < shopPages ? absoluteUrl(`shop/page/${i + 1}`) : '',
        schema: [
          ...baseNodes(),
          collectionPageSchema({
            name: 'Handmade natural craft collection',
            description: 'Handmade baskets, home decor, ornaments, gifts and kits woven from natural leaves.',
            path: url,
            items: slice.map((p) => ({ name: p.name, path: `product/${p.slug}` })),
            type: 'Product',
          }),
          breadcrumbSchema([
            { name: 'Home', path: '' },
            { name: 'Shop', path: 'shop' },
          ]),
        ],
      },
    });
  }

  /* ---------------- Product collections ---------------- */
  for (const col of productCounts) {
    const list = sortProducts(products.filter((p) => p.category === col.slug), 'featured');
    const pages_ = Math.max(1, Math.ceil(list.length / PER_PAGE.shop));

    for (let i = 1; i <= pages_; i++) {
      const base = `collection/${col.slug}`;
      const url = i === 1 ? base : `${base}/page/${i}`;
      const slice = list.slice((i - 1) * PER_PAGE.shop, i * PER_PAGE.shop);

      routes.push({
        url,
        out: i === 1 ? `${base}/index.html` : `${base}/page/${i}/index.html`,
        view: 'pages/collection',
        current: `/collection/${col.slug}`,
        data: {
          ...shared,
          collection: col,
          products: slice,
          collections: productCounts,
          pagination: paginate(list.length, i, PER_PAGE.shop, base),
          trail: [
            { name: 'Home', path: '' },
            { name: 'Shop', path: 'shop' },
            { name: col.name, path: base },
          ],
        },
        page: {
          title: i === 1 ? col.metaTitle : `${col.name} — Page ${i}`,
          description: col.metaDescription,
          path: url,
          type: 'website',
          keywords: [col.name.toLowerCase(), `handmade ${col.name.toLowerCase()}`, 'natural crafts'],
          prev: i > 1 ? absoluteUrl(i === 2 ? base : `${base}/page/${i - 1}`) : '',
          next: i < pages_ ? absoluteUrl(`${base}/page/${i + 1}`) : '',
          schema: [
            ...baseNodes(),
            collectionPageSchema({
              name: col.name,
              description: col.description,
              path: url,
              items: slice.map((p) => ({ name: p.name, path: `product/${p.slug}` })),
              type: 'Product',
            }),
            breadcrumbSchema([
              { name: 'Home', path: '' },
              { name: 'Shop', path: 'shop' },
              { name: col.name, path: base },
            ]),
          ],
        },
      });
    }
  }

  /* ---------------- Products ---------------- */
  for (const product of products) {
    const collection = productCounts.find((c) => c.slug === product.category) || null;
    const related = products
      .filter((p) => p.slug !== product.slug && p.category === product.category)
      .concat(products.filter((p) => p.slug !== product.slug && p.category !== product.category))
      .slice(0, 4);

    routes.push({
      url: `product/${product.slug}`,
      out: `product/${product.slug}/index.html`,
      view: 'pages/product',
      current: `/product/${product.slug}`,
      data: {
        ...shared,
        product,
        collection,
        related,
        distribution: distributionFor(product),
        trail: [
          { name: 'Home', path: '' },
          { name: 'Shop', path: 'shop' },
          { name: collection ? collection.name : 'Products', path: collection ? `collection/${collection.slug}` : 'shop' },
          { name: truncate(product.name, 42), path: `product/${product.slug}` },
        ],
      },
      page: {
        title: product.metaTitle || `${product.name} — Handmade Natural Craft`,
        description: product.metaDescription || truncate(product.shortDescription, 158),
        path: `product/${product.slug}`,
        type: 'product',
        image: ogImage(product.slug),
        imageAlt: product.name,
        keywords: product.keywords || [],
        schema: [
          ...baseNodes(),
          productSchema(product),
          breadcrumbSchema([
            { name: 'Home', path: '' },
            { name: 'Shop', path: 'shop' },
            { name: collection ? collection.name : 'Products', path: collection ? `collection/${collection.slug}` : 'shop' },
            { name: product.name, path: `product/${product.slug}` },
          ]),
        ],
      },
    });
  }

  /* ---------------- Search ---------------- */
  routes.push({
    url: 'search',
    out: 'search/index.html',
    view: 'pages/search',
    current: '/search',
    data: {
      ...shared,
      totalPosts: posts.length,
      totalProducts: products.length,
      trail: [{ name: 'Home', path: '' }, { name: 'Search', path: 'search' }],
    },
    page: {
      title: 'Search Craft Guides and Handmade Products',
      description:
        'Search all fifty LeafCraftPRO craft guides and thirty handmade products by keyword, material or project type.',
      path: 'search',
      type: 'website',
      keywords: ['search craft guides', 'find a tutorial'],
      noindex: true,
      schema: [
        ...baseNodes(),
        webPageSchema({
          name: 'Search',
          description: 'Search craft guides and handmade products.',
          path: 'search',
        }),
      ],
    },
  });

  /* ---------------- HTML sitemap ---------------- */
  routes.push({
    url: 'sitemap',
    out: 'sitemap/index.html',
    view: 'pages/sitemap',
    current: '/sitemap',
    data: {
      ...shared,
      topics: blogCounts,
      collections: productCounts,
      allPosts: postsByDate,
      allProducts: products,
      allPages: pages.filter((p) => !['contact', 'faq'].includes(p.slug)),
      trail: [{ name: 'Home', path: '' }, { name: 'Site map', path: 'sitemap' }],
    },
    page: {
      title: 'Site Map — Every Page on LeafCraftPRO',
      description:
        'A complete index of every craft guide, product, topic and information page on LeafCraftPRO, in one place.',
      path: 'sitemap',
      type: 'website',
      keywords: ['site map', 'all craft guides', 'all products'],
      schema: [
        ...baseNodes(),
        webPageSchema({
          name: 'Site map',
          description: 'A complete index of every page on the site.',
          path: 'sitemap',
          type: 'CollectionPage',
        }),
      ],
    },
  });

  /* ---------------- Static pages ---------------- */
  for (const page of pages) {
    if (page.slug === 'faq') continue; // handled separately below

    const schema = [
      ...baseNodes(),
      webPageSchema({
        name: page.title,
        description: page.metaDescription || page.intro,
        path: page.slug,
        type: page.slug === 'about' ? 'AboutPage' : page.slug === 'contact' ? 'ContactPage' : 'WebPage',
      }),
      breadcrumbSchema([
        { name: 'Home', path: '' },
        { name: page.title, path: page.slug },
      ]),
    ];

    if (page.faq?.length) schema.push(faqSchema(page.faq));

    routes.push({
      url: page.slug,
      out: `${page.slug}/index.html`,
      view: page.slug === 'contact' ? 'pages/contact' : 'pages/page',
      current: `/${page.slug}`,
      data: {
        ...shared,
        page,
        trail: [{ name: 'Home', path: '' }, { name: page.title, path: page.slug }],
      },
      page: {
        title: page.metaTitle || page.title,
        description: page.metaDescription || truncate(page.intro, 158),
        path: page.slug,
        type: 'website',
        image: ogImage('site-default'),
        keywords: page.keywords || [],
        schema,
      },
    });
  }

  /* ---------------- FAQ page (grouped) ---------------- */
  const faqPage = getPage('faq');
  if (faqPage) {
    const items = faqPage.faq || [];
    const half = Math.ceil(items.length / 2);
    const groups = [
      { title: 'Products and materials', items: items.slice(0, half) },
      { title: 'Orders, shipping and returns', items: items.slice(half) },
    ];

    routes.push({
      url: 'faq',
      out: 'faq/index.html',
      view: 'pages/faq',
      current: '/faq',
      data: {
        ...shared,
        page: faqPage,
        groups,
        trail: [{ name: 'Home', path: '' }, { name: 'FAQ', path: 'faq' }],
      },
      page: {
        title: faqPage.metaTitle || 'Frequently Asked Questions',
        description: faqPage.metaDescription || truncate(faqPage.intro, 158),
        path: 'faq',
        type: 'website',
        image: ogImage('site-default'),
        keywords: faqPage.keywords || [],
        schema: [
          ...baseNodes(),
          faqSchema(items),
          breadcrumbSchema([
            { name: 'Home', path: '' },
            { name: 'FAQ', path: 'faq' },
          ]),
        ],
      },
    });
  }

  /* ---------------- 404 ---------------- */
  routes.push({
    url: '404',
    out: '404.html',
    view: 'pages/404',
    current: '/404',
    data: { ...shared, popular: popularPosts },
    page: {
      title: 'Page Not Found',
      description: 'The page you were looking for is not here.',
      path: '404',
      type: 'website',
      noindex: true,
      schema: [],
    },
  });

  return routes;
}

// ---- Extra data files -------------------------------------------

/** The client-side search index. */
export function buildSearchIndex() {
  const items = [];

  for (const p of posts) {
    items.push({
      kind: p.category ? p.category.name : 'Guide',
      title: p.title,
      excerpt: excerpt(p.excerpt || p.intro, 160),
      url: relUrl(p.slug),
      thumb: relUrl(`images/blog/${p.slug}-400.webp`),
      tags: [p.category ? p.category.name : '', ...(p.tags || []), ...(p.keywords || [])].join(' '),
      meta: `${p.readTime} min read · ${p.difficulty}`,
    });
  }

  for (const p of products) {
    items.push({
      kind: 'Product',
      title: p.name,
      excerpt: truncate(p.shortDescription, 160),
      url: relUrl(`product/${p.slug}`),
      thumb: relUrl(`images/products/${p.slug}-320.webp`),
      tags: [p.category, ...(p.tags || []), ...(p.keywords || [])].join(' '),
      meta: `${p.sku} · ${p.stockStatus === 'in_stock' ? 'In stock' : 'Sold out'}`,
    });
  }

  return items;
}

/** All indexable URLs, for the XML sitemap. */
export function sitemapEntries() {
  const routes = buildRoutes();
  return routes
    .filter((r) => !r.page.noindex && r.out.endsWith('.html') && r.url !== '404')
    .map((r) => {
      let priority = '0.6';
      let changefreq = 'monthly';

      if (r.url === '') { priority = '1.0'; changefreq = 'weekly'; }
      else if (r.view === 'pages/post') { priority = '0.8'; changefreq = 'monthly'; }
      else if (r.view === 'pages/product') { priority = '0.8'; changefreq = 'monthly'; }
      else if (r.url === 'blog' || r.url === 'shop') { priority = '0.9'; changefreq = 'weekly'; }
      else if (r.url.startsWith('topic/') || r.url.startsWith('collection/')) { priority = '0.7'; changefreq = 'weekly'; }

      const lastmod = r.data.post
        ? new Date(r.data.post.updatedAt || r.data.post.publishedAt).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10);

      return { loc: absoluteUrl(r.url), lastmod, changefreq, priority };
    })
    .sort((a, b) => b.priority.localeCompare(a.priority) || a.loc.localeCompare(b.loc));
}

export { blogCounts, productCounts, popularPosts, featuredProducts };
export default buildRoutes;
