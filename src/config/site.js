/**
 * ============================================================
 *  LeafCraftPRO - Single source of truth for site identity.
 *  Change the values here and re-run `npm run build` to update
 *  every page, the sitemap, robots.txt, RSS feed and schema.
 * ============================================================
 */

export const site = {
  // ---- Core identity -------------------------------------
  name: 'LeafCraftPRO',
  legalName: 'LeafCraftPRO',
  tagline: 'Craft · Learn · Create',
  shortDescription:
    'Handmade natural crafts and step-by-step tutorials woven from palm and coconut leaves.',
  longDescription:
    'LeafCraftPRO crafts unique, beautiful objects from natural palm and coconut leaves, and publishes free step-by-step tutorials so you can weave them yourself. Every guide is tested by hand before it is published.',

  /** Shown under the product name on every product page. */
  productTagline: "Nature's beauty, woven by hand",

  // ---- Deployment -----------------------------------------
  // Used for canonical URLs, Open Graph, the sitemap and robots.txt.
  // Override at build time with SITE_URL=https://example.com npm run build
  url: process.env.SITE_URL || 'https://leafcraftpro.site',

  // Set to '/subfolder' when the site is not at the domain root.
  basePath: process.env.SITE_BASE_PATH || '',

  language: 'en',
  locale: 'en_US',
  themeColor: '#1C5638',
  brandColor: '#1C5638',

  // ---- Contact --------------------------------------------
  email: 'hello@leafcraftpro.site',
  supportEmail: 'support@leafcraftpro.site',
  phone: '+1 (555) 010-2030',
  phoneHref: '+15550102030',
  address: {
    street: '12 Garden Lane',
    city: 'Portland',
    region: 'OR',
    postalCode: '97201',
    country: 'United States',
    countryCode: 'US',
  },
  geo: { latitude: 45.5152, longitude: -122.6784 },
  openingHours: 'Mo-Fr 09:00-17:00',
  priceRange: '$$',

  // ---- Social profiles ------------------------------------
  // These are emitted in the Organization schema `sameAs` array
  // and rendered in the header, footer and share rows.
  social: {
    facebook: 'https://www.facebook.com/leafcraftpro',
    instagram: 'https://www.instagram.com/leafcraftpro',
    pinterest: 'https://www.pinterest.com/leafcraftpro',
    youtube: 'https://www.youtube.com/@leafcraftpro',
    twitter: 'https://x.com/leafcraftpro',
  },

  // ---- Store ----------------------------------------------
  currency: { code: 'USD', symbol: '$' },
  freeShippingThreshold: 50,
  shippingNote: 'Free shipping on orders over $50',
  returnsNote: '30-day easy returns',

  // ---- Publisher / author ---------------------------------
  author: {
    name: 'Maya Ellis',
    slug: 'maya-ellis',
    role: 'Founder & Head Maker',
    bio: 'Maya has been weaving with palm and coconut leaves for over fifteen years. She founded LeafCraftPRO to keep traditional leaf craft alive and to teach it in plain, honest language.',
  },

  // ---- Feature flags --------------------------------------
  features: {
    shop: true,
    blog: true,
    newsletter: true,
    search: true,
  },

  // ---- Analytics (leave empty to disable) -----------------
  analytics: {
    googleAnalyticsId: '',
    facebookPixelId: '',
    plausibleDomain: '',
  },

  // ---- Verification meta tags -----------------------------
  verification: {
    google: '',
    pinterest: '',
    bing: '',
  },
};

/** Absolute URL helper — respects basePath. */
export function absoluteUrl(path = '') {
  const clean = String(path || '').replace(/^\/+/, '');
  return `${site.url}${site.basePath}/${clean}`.replace(/([^:]\/)\/+/g, '$1');
}

/** Root-relative URL helper — respects basePath. */
export function relUrl(path = '') {
  const clean = String(path || '').replace(/^\/+/, '');
  return `${site.basePath}/${clean}`.replace(/\/{2,}/g, '/');
}

export default site;
