/**
 * ============================================================
 *  SEO engine.
 *  Builds the <head> meta block, canonical URLs, social cards
 *  and every JSON-LD schema graph the site needs. Everything is
 *  derived from the data — no per-page hand written schema.
 * ============================================================
 */

import { site, absoluteUrl, relUrl } from '../config/site.js';
import { esc, stripTags, truncate, formatDate, excerpt, ogImage } from './helpers.js';

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;
const LOGO_ID = `${site.url}/#logo`;

// ---- Meta -------------------------------------------------------

/**
 * Render the full SEO <head> block.
 * @param {object} o
 * @param {string} o.title       page title (without the site suffix)
 * @param {string} o.description meta description
 * @param {string} o.path        route path, e.g. 'shop' or 'about'
 * @param {string} o.type        og:type — website | article | product
 * @param {string} o.image       absolute URL of the share image
 * @param {string} o.imageAlt    alt text for the share image
 * @param {string[]} o.keywords
 * @param {boolean} o.noindex
 * @param {object} o.article     { publishedTime, modifiedTime, author, section, tags }
 */
export function renderMeta(o = {}) {
  const {
    title,
    description,
    path = '',
    type = 'website',
    image,
    imageAlt = '',
    keywords = [],
    noindex = false,
    article = null,
    prev = '',
    next = '',
  } = o;

  const url = absoluteUrl(path);

  // Only append the brand when the title does not already carry it —
  // otherwise the home page renders "LeafCraftPRO — … | LeafCraftPRO".
  const hasBrand = title && title.toLowerCase().includes(site.name.toLowerCase());
  const fullTitle = !title
    ? `${site.name} — ${site.tagline}`
    : hasBrand
      ? title
      : `${title} | ${site.name}`;

  const desc = truncate(stripTags(description || site.shortDescription), 158);
  const shareImage = image || ogImage('site-default');

  const out = [];
  out.push(`<title>${esc(fullTitle)}</title>`);
  out.push(`<meta name="description" content="${esc(desc)}">`);
  if (keywords.length) {
    out.push(`<meta name="keywords" content="${esc(keywords.slice(0, 12).join(', '))}">`);
  }
  out.push(`<link rel="canonical" href="${esc(url)}">`);
  if (noindex) out.push('<meta name="robots" content="noindex, nofollow">');
  else out.push('<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">');
  if (prev) out.push(`<link rel="prev" href="${esc(prev)}">`);
  if (next) out.push(`<link rel="next" href="${esc(next)}">`);

  // Open Graph
  out.push(`<meta property="og:type" content="${esc(type)}">`);
  out.push(`<meta property="og:site_name" content="${esc(site.name)}">`);
  out.push(`<meta property="og:title" content="${esc(title || site.name)}">`);
  out.push(`<meta property="og:description" content="${esc(desc)}">`);
  out.push(`<meta property="og:url" content="${esc(url)}">`);
  out.push(`<meta property="og:locale" content="${esc(site.locale)}">`);
  out.push(`<meta property="og:image" content="${esc(shareImage)}">`);
  out.push('<meta property="og:image:width" content="1200">');
  out.push('<meta property="og:image:height" content="630">');
  if (imageAlt) out.push(`<meta property="og:image:alt" content="${esc(imageAlt)}">`);

  // Twitter / X
  out.push('<meta name="twitter:card" content="summary_large_image">');
  out.push(`<meta name="twitter:title" content="${esc(title || site.name)}">`);
  out.push(`<meta name="twitter:description" content="${esc(desc)}">`);
  out.push(`<meta name="twitter:image" content="${esc(shareImage)}">`);
  if (imageAlt) out.push(`<meta name="twitter:image:alt" content="${esc(imageAlt)}">`);

  // Article-specific
  if (article) {
    if (article.publishedTime) {
      out.push(`<meta property="article:published_time" content="${esc(article.publishedTime)}">`);
    }
    if (article.modifiedTime) {
      out.push(`<meta property="article:modified_time" content="${esc(article.modifiedTime)}">`);
    }
    if (article.author) out.push(`<meta property="article:author" content="${esc(article.author)}">`);
    if (article.section) out.push(`<meta property="article:section" content="${esc(article.section)}">`);
    for (const tag of article.tags || []) {
      out.push(`<meta property="article:tag" content="${esc(tag)}">`);
    }
  }

  // Verification
  if (site.verification.google) {
    out.push(`<meta name="google-site-verification" content="${esc(site.verification.google)}">`);
  }
  if (site.verification.pinterest) {
    out.push(`<meta name="p:domain_verify" content="${esc(site.verification.pinterest)}">`);
  }
  if (site.verification.bing) {
    out.push(`<meta name="msvalidate.01" content="${esc(site.verification.bing)}">`);
  }

  return out.join('\n    ');
}

// ---- Schema building blocks -------------------------------------

const organisation = () => {
  const sameAs = Object.values(site.social).filter(Boolean);
  const schema = {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    description: site.longDescription,
    logo: {
      '@type': 'ImageObject',
      '@id': LOGO_ID,
      url: absoluteUrl('assets/img/logo.svg'),
      contentUrl: absoluteUrl('assets/img/logo.svg'),
      width: 512,
      height: 512,
      caption: site.name,
    },
    image: { '@id': LOGO_ID },
    sameAs,
    founder: {
      '@type': 'Person',
      name: site.author.name,
      jobTitle: site.author.role,
      url: absoluteUrl(`author/${site.author.slug}`),
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: site.email,
        telephone: site.phoneHref,
        availableLanguage: ['English'],
        areaServed: 'Worldwide',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.countryCode,
    },
    foundingDate: '2011',
    numberOfEmployees: { '@type': 'QuantitativeValue', value: 6 },
    slogan: site.tagline,
  };
  if (site.geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    };
  }
  return schema;
};

const website = () => ({
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: site.url,
  name: site.name,
  description: site.shortDescription,
  publisher: { '@id': ORG_ID },
  inLanguage: site.language,
  potentialAction: [
    {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${absoluteUrl('search')}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  ],
});

/** BreadcrumbList from an array of { name, path }. */
export const breadcrumbSchema = (items = []) => ({
  '@type': 'BreadcrumbList',
  '@id': `${absoluteUrl(items[items.length - 1]?.path || '')}#breadcrumb`,
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

/** Person node for an author. */
export const personSchema = (author) => ({
  '@type': 'Person',
  '@id': `${absoluteUrl(`author/${author.slug}`)}#person`,
  name: author.name,
  url: absoluteUrl(`author/${author.slug}`),
  jobTitle: author.role,
  description: author.bio,
  worksFor: { '@id': ORG_ID },
  sameAs: Object.values(author.social || {}).filter(Boolean),
});

/** FAQPage from an array of { q, a }. */
export const faqSchema = (faqs = []) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

/** BlogPosting / Article for a post. */
export const articleSchema = (post, category) => {
  const url = absoluteUrl(post.slug);
  const image = ogImage(post.slug);
  const schema = {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    isPartOf: { '@id': SITE_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: truncate(post.title, 110, ''),
    name: post.title,
    description: post.metaDescription || excerpt(post.excerpt || post.intro, 160),
    url,
    datePublished: formatDate(post.publishedAt, 'machine'),
    dateModified: formatDate(post.updatedAt || post.publishedAt, 'machine'),
    author: { '@id': `${absoluteUrl(`author/${post.authorSlug}`)}#person` },
    publisher: { '@id': ORG_ID },
    image: {
      '@type': 'ImageObject',
      url: image,
      width: 1200,
      height: 630,
      caption: post.imageAlt || post.title,
    },
    thumbnailUrl: image,
    inLanguage: site.language,
    wordCount: post.wordCount,
    timeRequired: `PT${post.readTime}M`,
    articleSection: category ? category.name : undefined,
    keywords: (post.keywords || []).join(', '),
    about: (post.tags || []).map((t) => ({ '@type': 'Thing', name: t })),
    isAccessibleForFree: true,
    creativeWorkStatus: 'Published',
  };
  if (post.difficulty) {
    schema.educationalLevel = post.difficulty;
  }
  return schema;
};

/** HowTo schema for a post that contains a steps block. */
export const howToSchema = (post) => {
  const stepsBlock = (post.blocks || []).find((b) => b.type === 'steps');
  if (!stepsBlock || !stepsBlock.items?.length) return null;

  const materials = (post.blocks || []).find((b) => b.type === 'materials');
  const schema = {
    '@type': 'HowTo',
    '@id': `${absoluteUrl(post.slug)}#howto`,
    name: post.title,
    description: post.metaDescription || excerpt(post.excerpt, 160),
    image: { '@type': 'ImageObject', url: ogImage(post.slug), width: 1200, height: 630 },
    totalTime: `PT${Math.max(30, post.readTime * 20)}M`,
    estimatedCost: { '@type': 'MonetaryAmount', currency: site.currency.code, value: '10' },
    supply: (materials?.items || ['Fresh palm leaves', 'Scissors']).map((m) => ({
      '@type': 'HowToSupply',
      name: stripTags(m),
    })),
    tool: [
      { '@type': 'HowToTool', name: 'Sharp scissors' },
      { '@type': 'HowToTool', name: 'Bowl of water' },
    ],
    step: stepsBlock.items.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.text,
      url: `${absoluteUrl(post.slug)}#${String(s.title).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    })),
  };
  return schema;
};

/** Product schema with offers and aggregate rating. */
export const productSchema = (product) => {
  const url = absoluteUrl(`product/${product.slug}`);
  const price = product.salePrice || product.price;
  const schema = {
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    description: product.metaDescription || truncate(product.shortDescription, 300),
    url,
    sku: product.sku,
    mpn: product.sku,
    category: product.category,
    image: [ogImage(product.slug)],
    brand: { '@type': 'Brand', name: site.name },
    material: product.material,
    weight: product.weight,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Dimensions', value: product.dimensions },
      { '@type': 'PropertyValue', name: 'Colour', value: product.colour },
      { '@type': 'PropertyValue', name: 'Handmade', value: 'Yes' },
    ],
    offers: {
      '@type': 'Offer',
      '@id': `${url}#offer`,
      url,
      priceCurrency: site.currency.code,
      price: Number(price).toFixed(2),
      priceValidUntil: '2027-12-31',
      availability:
        product.stockStatus === 'in_stock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': ORG_ID },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: String(site.freeShippingThreshold ? '0.00' : '5.00'),
          currency: site.currency.code,
        },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US' },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'US',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnShippingFees',
      },
    },
  };

  if (product.reviews?.length) {
    schema.review = product.reviews.map((r) => ({
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      author: { '@type': 'Person', name: r.name },
      datePublished: r.date,
      reviewBody: r.text,
    }));
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(product.rating).toFixed(1),
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }
  return schema;
};

/** ItemList for listing pages (shop, blog index, category). */
export const itemListSchema = (items, { name, path, type = 'Thing' }) => ({
  '@type': 'ItemList',
  '@id': `${absoluteUrl(path)}#itemlist`,
  name,
  numberOfItems: items.length,
  itemListOrder: 'https://schema.org/ItemListOrderDescending',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    url: absoluteUrl(item.path),
    ...(type === 'Product' ? { item: { '@type': 'Product', name: item.name, url: absoluteUrl(item.path) } } : {}),
  })),
});

/** CollectionPage / WebPage wrapper for a listing page. */
export const collectionPageSchema = ({ name, description, path, items = [], type = 'Product' }) => ({
  '@type': 'CollectionPage',
  '@id': `${absoluteUrl(path)}#collection`,
  name,
  description,
  url: absoluteUrl(path),
  isPartOf: { '@id': SITE_ID },
  inLanguage: site.language,
  ...(items.length ? { mainEntity: itemListSchema(items, { name, path, type }) } : {}),
});

/** WebPage node for static pages. */
export const webPageSchema = ({ name, description, path, type = 'WebPage' }) => ({
  '@type': type,
  '@id': `${absoluteUrl(path)}#webpage`,
  name,
  description,
  url: absoluteUrl(path),
  isPartOf: { '@id': SITE_ID },
  inLanguage: site.language,
  dateModified: formatDate(new Date(), 'machine'),
  publisher: { '@id': ORG_ID },
});

/** Serialise a graph of nodes into one script tag. */
export function renderSchema(nodes = []) {
  const graph = nodes.filter(Boolean).map((n) => {
    // Strip undefined keys so the JSON stays clean.
    const clean = {};
    for (const [k, v] of Object.entries(n)) {
      if (v === undefined || v === null || v === '') continue;
      if (Array.isArray(v) && v.length === 0) continue;
      clean[k] = v;
    }
    return clean;
  });

  const payload = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  // Guard against `</script>` breaking out of the tag.
  const json = JSON.stringify(payload, null, 0).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${json}</script>`;
}

/** The node set every page includes. */
export const baseNodes = () => [organisation(), website()];

export default {
  renderMeta,
  renderSchema,
  baseNodes,
  breadcrumbSchema,
  personSchema,
  faqSchema,
  articleSchema,
  howToSchema,
  productSchema,
  itemListSchema,
  collectionPageSchema,
  webPageSchema,
};
