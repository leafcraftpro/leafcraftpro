# Blog post data schema — LeafCraftPRO

Every blog post is a plain JavaScript object. Posts are grouped into files
`src/data/posts/part-1.js` … `part-5.js`, each exporting an array.

## File shape

```js
// src/data/posts/part-1.js
export default [
  { /* post 1 */ },
  { /* post 2 */ },
];
```

## Post object

```js
{
  slug: 'how-to-make-a-palm-leaf-basket',   // string, root-level URL slug, kebab-case, unique
  title: 'How to Make a Palm Leaf Basket at Home',  // 45–65 chars, primary keyword near the front
  category: 'palm-leaf-crafts',             // one of the 6 category slugs below
  excerpt: '...',                            // 140–165 chars, plain text, no HTML, compelling summary
  metaTitle: '...',                          // <= 60 chars, includes primary keyword
  metaDescription: '...',                    // 140–158 chars, includes primary keyword + a call to action
  keywords: ['palm leaf basket', '...'],     // 4–7 strings, lowercase
  tags: ['beginner', 'weaving'],             // 2–5 short lowercase strings
  publishedAt: '2026-03-14',                 // ISO date, spread posts across 2025-01 .. 2026-09
  readTime: 8,                               // integer minutes, 5–14
  difficulty: 'Beginner',                    // 'Beginner' | 'Intermediate' | 'Advanced'
  image: 'how-to-make-a-palm-leaf-basket',   // WITHOUT extension — equals the slug
  imageAlt: 'A finished handwoven palm leaf basket on a cream linen surface',
  intro: '<p>...</p>',                       // 2–3 short paragraphs of HTML, the hook
  blocks: [ /* see below */ ],
  faq: [                                     // 3–5 entries, real questions people search
    { q: 'How long does a palm leaf basket take to make?', a: '...' }
  ]
}
```

## Category slugs (use exactly these)

| slug | name |
|---|---|
| `palm-leaf-crafts` | Palm Leaf Crafts |
| `coconut-leaf-crafts` | Coconut Leaf Crafts |
| `baskets-weaving` | Baskets & Weaving |
| `home-decor` | Home Decor |
| `kids-crafts` | Kids Crafts |
| `eco-living` | Eco Living |

## Block types (use a varied mix — never repeat the same type twice in a row)

```js
{ type: 'heading', level: 2, text: 'Weaving the first row' }
{ type: 'paragraph', html: '<p>Two to four sentences of genuinely useful guidance.</p>' }
{ type: 'materials', title: "What You'll Need", items: ['Fresh palm leaves', 'Sharp scissors'] }
{ type: 'steps', title: 'Step-by-Step Instructions', items: [
    { title: 'Prepare the leaves', text: 'One to three sentences describing exactly what to do.' }
] }
{ type: 'tips', title: 'Helpful Tips', items: ['A specific, non-obvious tip.', 'Another one.'] }
{ type: 'list', ordered: true, items: ['First item', 'Second item'] }
{ type: 'notice', tone: 'info', text: 'A short callout. tone is info | warning | success.' }
{ type: 'quote', text: 'A memorable line.', cite: 'Maya Ellis' }
{ type: 'table', head: ['Technique', 'Best for'], rows: [['Over-under weave', 'Flat bases']] }
{ type: 'image', src: 'how-to-make-a-palm-leaf-basket', alt: '...', caption: '...' }
{ type: 'cta', title: 'Ready to start weaving?', text: 'One sentence.', buttonText: 'Shop the collection', buttonLink: '/shop' }
```

Rules for blocks:
- **8–14 blocks** per post.
- Open with a `paragraph` block (the intro field already carries the hook, so the first block
  should go deeper — background, why the project matters, what makes it satisfying).
- Include at least one `heading` every 2–4 blocks so the article scans well.
- Include at least one `image` block placed mid-article. Its `src` is a slug WITHOUT extension.
  Use the post's own slug, or the slug of another post from the same category, or one of the
  shared slugs listed at the bottom of this file.
- Every how-to post must contain a `steps` block with 4–7 steps.
- Every post must end with either a `cta` block or a `tips` block.
- Do NOT include HTML inside `items`, `text`, `q` or `a` — plain text only (except `paragraph.html`).
- No emoji anywhere.

## Tone and quality bar

- Write like a working maker, not a content farm. Warm, precise, first-person where it fits.
- **Be specific.** "Soak the strips for ten minutes until they bend without cracking" beats
  "prepare the leaves properly". Include real measurements, timings and material quantities.
- **Be honest.** Mention where a step is fiddly, what goes wrong, and how to rescue it.
- British-leaning spelling is fine (colour, metre) — be consistent within a post.
- No filler openings like "In today's world" or "Have you ever wondered". Start with substance.
- Each post must be **genuinely different** in structure and content. Do not template-fill.
- Target **900–1,400 words** of body content per post (intro + blocks).

## Shared image slugs you may reuse for inline `image` blocks

`how-to-make-a-palm-leaf-basket`, `how-to-prepare-palm-leaves`, `how-to-weave-a-basket-base`,
`basket-weaving-tools`, `useful-home-crafts-with-palm-leaves`, `eco-friendly-home-decor`,
`sustainable-crafting-guide`, `handmade-gift-ideas`, `natural-table-decor`, `woven-plant-hangers`,
`coconut-leaf-bird`, `palm-leaf-weaving-for-beginners`, `easy-leaf-crafts-for-kids`,
`how-to-care-for-woven-crafts`
