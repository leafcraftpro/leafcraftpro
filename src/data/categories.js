/**
 * ============================================================
 *  Categories, collections and authors.
 *  Slugs here are the single source of truth for taxonomy URLs.
 * ============================================================
 */

/** Blog / tutorial categories — served at /topic/<slug> */
export const blogCategories = [
  {
    slug: 'palm-leaf-crafts',
    name: 'Palm Leaf Crafts',
    shortName: 'Palm Leaf',
    icon: 'leaf',
    tagline: 'Weaving, folding and shaping fresh palm leaves',
    description:
      'Everything woven from fresh palm leaves — baskets, planters, wall hangings, placemats and lampshades. These guides start from raw leaves and take you through softening, cutting and weaving to a finished object you can actually use.',
    metaTitle: 'Palm Leaf Crafts: Tutorials, Guides and Projects',
    metaDescription:
      'Learn palm leaf craft from scratch. Step-by-step tutorials for weaving baskets, planters, placemats, wall hangings and lampshades from natural palm leaves.',
  },
  {
    slug: 'coconut-leaf-crafts',
    name: 'Coconut Leaf Crafts',
    shortName: 'Coconut Leaf',
    icon: 'palette',
    tagline: 'Traditional folding crafts with coconut leaves',
    description:
      'Coconut leaves fold rather than weave, and the results are charmingly small — birds, fish, flowers, stars and bracelets. These are the traditional crafts many of us learned as children, written down properly at last.',
    metaTitle: 'Coconut Leaf Crafts: Folding Tutorials and Ideas',
    metaDescription:
      'Traditional coconut leaf folding crafts explained step by step — birds, fish, flowers, stars and bracelets you can make in under an hour with two leaves.',
  },
  {
    slug: 'baskets-weaving',
    name: 'Baskets & Weaving',
    shortName: 'Baskets',
    icon: 'box',
    tagline: 'Bases, handles, rims and everything structural',
    description:
      'The structural side of leaf craft: how to build a base that sits flat, weave walls that stay straight, finish a rim that holds, and attach a handle that will not pull out. If you want to make baskets well, start here.',
    metaTitle: 'Basket Weaving Tutorials: Bases, Handles and Rims',
    metaDescription:
      'Learn basket weaving with natural leaves. Tutorials covering bases, walls, rims, handles, tools and the seven mistakes that ruin an otherwise good basket.',
  },
  {
    slug: 'home-decor',
    name: 'Home Decor',
    shortName: 'Home Decor',
    icon: 'home',
    tagline: 'Natural objects for a calmer home',
    description:
      'Woven pieces that earn their place in a room — plant hangers, wall decor, table settings, napkin rings and seasonal decorations. Includes honest advice on styling woven objects without making a space look like a gift shop.',
    metaTitle: 'Natural Home Decor Ideas: Woven and Handmade',
    metaDescription:
      'Natural home decor ideas using woven leaf crafts. Style baskets, plant hangers, wall decor and table settings, plus seasonal and eco-friendly decorating guides.',
  },
  {
    slug: 'kids-crafts',
    name: 'Kids Crafts',
    shortName: 'Kids',
    icon: 'sparkles',
    tagline: 'Leaf craft projects for small hands',
    description:
      'Projects chosen because children genuinely enjoy them, not because they photograph well. Every guide includes age guidance, supervision notes and the safety points that actually matter when sharp tools meet fresh leaves.',
    metaTitle: 'Leaf Crafts for Kids: Safe, Easy Nature Projects',
    metaDescription:
      'Easy leaf craft projects for children, with age guidance and safety notes. Leaf crowns, printing, woven fish and rainy day nature activities the whole family can do.',
  },
  {
    slug: 'eco-living',
    name: 'Eco Living',
    shortName: 'Eco Living',
    icon: 'globe',
    tagline: 'Materials, care and honest trade-offs',
    description:
      'What natural materials are actually good at, what they are not, and how to look after woven objects so they last. No greenwashing — where plastic wins, we say so.',
    metaTitle: 'Eco Living: Natural Materials and Care',
    metaDescription:
      'An honest look at natural materials and sustainable crafting. Compare palm leaf and plastic, learn how to care for woven crafts and source leaves responsibly.',
  },
];

/** Shop collections — served at /collection/<slug> */
export const productCategories = [
  {
    slug: 'baskets',
    name: 'Baskets',
    icon: 'box',
    tagline: 'Storage, gifting and everyday carrying',
    description:
      'Handwoven baskets in every size, from a small gift basket you can hold in one hand to a laundry basket that swallows a week of washing. Each one is woven to order and keeps its shape when empty.',
    metaTitle: 'Handwoven Baskets: Natural Palm Leaf Storage',
    metaDescription:
      'Shop handwoven natural palm leaf baskets — gift baskets, bread baskets, fruit bowls, market baskets and large laundry baskets. Plastic-free and made by hand.',
  },
  {
    slug: 'home-decor',
    name: 'Home Decor',
    icon: 'home',
    tagline: 'Woven pieces for walls, tables and shelves',
    description:
      'The decorative side of the workshop: wall hangings, lampshades, plant pot covers, placemats and coasters. Made to be used, not just looked at.',
    metaTitle: 'Natural Home Decor: Woven Wall Art and Tableware',
    metaDescription:
      'Shop natural woven home decor — palm leaf wall hangings, lampshades, plant pot covers, placemats and coaster sets. Handmade, plastic-free and built to last.',
  },
  {
    slug: 'ornaments',
    name: 'Ornaments',
    icon: 'heart',
    tagline: 'Small folded figures and hanging decorations',
    description:
      'Birds, fish, flowers and stars folded from coconut and palm leaves. Light, charming and completely compostable — the natural alternative to a plastic gift bow.',
    metaTitle: 'Woven Ornaments: Leaf Birds, Fish and Stars',
    metaDescription:
      'Shop handmade woven leaf ornaments — coconut leaf birds, fish, flowers and stars. Lightweight natural decorations for shelves, trees and gift wrapping.',
  },
  {
    slug: 'gifts',
    name: 'Gifts & Keepsakes',
    icon: 'gift',
    tagline: 'Boxes, pouches and gift-ready pieces',
    description:
      'Woven gift boxes with fitted lids, keepsake boxes, miniature baskets and gift topper sets. The packaging becomes part of the present, and it does not end up in a bin.',
    metaTitle: 'Handmade Gift Boxes and Woven Keepsakes',
    metaDescription:
      'Shop handmade woven gift boxes, keepsake boxes, miniature baskets and natural gift toppers. Reusable packaging made from palm leaves instead of plastic.',
  },
  {
    slug: 'kids-crafts',
    name: 'Kids Crafts',
    icon: 'sparkles',
    tagline: 'Kits and safe woven pieces for children',
    description:
      'Weaving kits with pre-cut, softened leaf strips and printed instructions, plus finished pieces safe for a child to handle. Recommended for ages ten and up with adult supervision.',
    metaTitle: 'Kids Craft Kits: Leaf Weaving for Children',
    metaDescription:
      'Shop leaf weaving kits and safe woven crafts for children. Pre-cut softened palm leaf strips, printed guides and age-appropriate projects from age ten up.',
  },
  {
    slug: 'sets',
    name: 'Sets & Collections',
    icon: 'layers',
    tagline: 'Matching pieces, better value',
    description:
      'Curated sets that work together — a complete home starter set, a matched dining table set and a gift set for the craft lover in your life. Buying as a set saves between fifteen and twenty percent.',
    metaTitle: 'Woven Craft Sets: Home, Dining and Gift Bundles',
    metaDescription:
      'Shop curated sets of handmade woven crafts — home starter sets, matched dining table sets and gift bundles. Save up to twenty percent versus buying separately.',
  },
];

/** Authors — served at /author/<slug> */
export const authors = [
  {
    slug: 'romen-roy',
    name: 'Romen Roy',
    role: 'Founder & Head Maker',
    bio: 'Romen has been weaving with palm and coconut leaves for over fifteen years. He founded LeafCraftPRO to keep traditional leaf craft alive and to teach it in plain, honest language.',
    location: 'Portland, Oregon',
    image: 'romen-roy',
    imageAlt: 'Romen Roy, founder of LeafCraftPRO, seated outdoors with a woven leaf craft',
    social: {
      instagram: 'https://www.instagram.com/leafcraftpro',
      pinterest: 'https://www.pinterest.com/leafcraftpro',
    },
  },
  {
    slug: 'theo-nakamura',
    name: 'Theo Nakamura',
    role: 'Workshop Lead',
    bio: 'Theo runs the LeafCraftPRO workshop, where every tutorial is tested by hand before it is published. He writes about structure, tension and why a basket that looks fine on the bench can still fail in a week.',
    location: 'Portland, Oregon',
    social: {
      instagram: 'https://www.instagram.com/leafcraftpro',
    },
  },
];

/** Lookup helpers -------------------------------------------------- */

export const getBlogCategory = (slug) =>
  blogCategories.find((c) => c.slug === slug) || null;

export const getProductCategory = (slug) =>
  productCategories.find((c) => c.slug === slug) || null;

export const getAuthor = (slug) =>
  authors.find((a) => a.slug === slug) || authors[0];

export default { blogCategories, productCategories, authors };
