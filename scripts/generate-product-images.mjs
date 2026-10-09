/**
 * ============================================================
 *  LeafCraftPRO — product image generation via Cloudflare Workers AI.
 *
 *  Generates unique photorealistic product photographs for the
 *  craft catalogue, in the studio style the rest of the catalogue
 *  uses: cream linen sweep, soft diffused daylight, warm natural
 *  palm tones, editorial craft-catalogue framing.
 *
 *  Usage:
 *    node scripts/generate-product-images.mjs [--only <slug>]
 *
 *  Auth (either form works — a Global API Key or a scoped token):
 *    CLOUDFLARE_API_KEY + CLOUDFLARE_EMAIL   (Global API Key)
 *    CLOUDFLARE_API_TOKEN                    (scoped token)
 *
 *  Writes the raw PNG into .raw-images/raw/ and then hands off to
 *  add-image.js so the WebP derivatives, LQIP, OG card and manifest
 *  entry are produced by exactly the same pipeline as every other
 *  product in the catalogue.
 * ============================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW_DIR = path.join(ROOT, '.raw-images', 'raw');

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'd691392e25c2435bbf5f68636796446c';
const API_KEY = process.env.CLOUDFLARE_API_KEY || '';
const EMAIL = process.env.CLOUDFLARE_EMAIL || '';
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';

const MODEL = '@cf/black-forest-labs/flux-1-schnell';

/**
 * The house style. Every prompt is wrapped in this so the whole
 * catalogue keeps one photographic voice.
 */
const STYLE =
  'photorealistic studio product photograph, cream linen backdrop, soft diffused ' +
  'daylight from the upper left, warm natural straw and pale green tones, ' +
  'shallow depth of field, sharp focus on the weave detail, editorial craft ' +
  'catalogue style, centred composition, generous negative space, ' +
  'no text, no watermark, no logo, no hands, no people';

/**
 * One entry per product. `subject` describes only the object; the
 * style suffix is appended automatically.
 */
const PRODUCTS = [
  {
    slug: 'woven-wall-pocket-trio',
    subject:
      'a set of three shallow woven natural palm leaf wall pockets hanging in a ' +
      'vertical column on a pale plaster wall, each pocket with a scalloped woven ' +
      'rim and a small hanging loop, filled with dried eucalyptus stems',
  },
  {
    slug: 'palm-leaf-tea-light-holder-set',
    subject:
      'a set of three small woven natural palm leaf tea light holders arranged in a ' +
      'loose triangle, each a flared cup with a rolled rim cradling a lit cream ' +
      'votive candle, warm glow on the weave',
  },
  {
    slug: 'woven-jewellery-organiser',
    subject:
      'a woven natural palm leaf jewellery organiser with three shallow stacked ' +
      'trays, a small ring bar across the top tier holding two thin gold rings, ' +
      'delicate earrings resting in the lower tray',
  },
  {
    slug: 'coconut-leaf-pocket-mirror-case',
    subject:
      'a closed woven natural palm leaf pocket mirror case, rounded rectangular ' +
      'pouch with a folded flap and a carved disc button closure, a small round ' +
      'mirror resting beside it, tight fine weave',
  },
  {
    slug: 'woven-napkin-ring-set',
    subject:
      'a set of four woven natural palm leaf napkin rings, three standing upright ' +
      'and one lying flat, each threaded with a softly folded ivory linen napkin, ' +
      'clean minimal arrangement',
  },
  // ---- Batch 2: 20 new products --------------------------------
  {
    slug: 'woven-bike-basket',
    subject:
      'a woven natural palm leaf bicycle basket with a reinforced rectangular base ' +
      'and two leather-free woven straps, mounted at the front of a vintage cream ' +
      'bicycle, holding a small bouquet of dried grass',
  },
  {
    slug: 'palm-leaf-sewing-basket',
    subject:
      'a round woven natural palm leaf sewing basket with a hinged domed lid and a ' +
      'single woven handle, lid open to show wooden spools of thread and a pincushion ' +
      'inside, warm straw tones',
  },
  {
    slug: 'woven-fireside-log-basket',
    subject:
      'a large shallow woven natural palm leaf log basket with thick rope-look ' +
      'handles, filled with two birch logs, standing on a pale stone hearth, ' +
      'sturdy wide weave',
  },
  {
    slug: 'hanging-palm-leaf-planter',
    subject:
      'a woven natural palm leaf hanging planter suspended by three braided cords, ' +
      'holding a trailing pothos plant, against a soft cream plaster wall, ' +
      'clean conical weave',
  },
  {
    slug: 'woven-leaf-wall-mirror',
    subject:
      'a round wall mirror framed with an intricate woven natural palm leaf border ' +
      'in a sunburst pattern, hanging on a pale plaster wall, reflections soft and ' +
      'diffused',
  },
  {
    slug: 'woven-cone-wall-sconce',
    subject:
      'a pair of woven natural palm leaf wall sconces, each a shallow cone shape ' +
      'with a small woven loop, cradling a warm pillar candle, mounted symmetrically ' +
      'on a pale wall',
  },
  {
    slug: 'woven-half-moon-wall-basket',
    subject:
      'a single half-moon shaped woven natural palm leaf wall basket with a flat ' +
      'woven back and a deep curved pocket, holding dried pampas grass, mounted on ' +
      'a cream wall',
  },
  {
    slug: 'woven-leaf-tiered-stand',
    subject:
      'a two-tier woven natural palm leaf table stand with a slender central post ' +
      'and two flat woven circular trays, the top tray holding three small pears, ' +
      'elegant minimal design',
  },
  {
    slug: 'woven-nesting-trays',
    subject:
      'a set of three woven natural palm leaf nesting trays with low rolled rims, ' +
      'arranged overlapping from largest to smallest, empty and clean, subtle ' +
      'weave texture',
  },
  {
    slug: 'woven-drawer-dividers-set',
    subject:
      'a set of four shallow woven natural palm leaf drawer organiser boxes of ' +
      'varying sizes arranged neatly in a grid, one holding folded linen, ' +
      'clean rectangular weave',
  },
  {
    slug: 'coconut-leaf-flower-garland',
    subject:
      'a long garland strung from folded coconut leaf flowers alternating with ' +
      'small pale leaf stars, draped in a soft curve on a cream linen surface, ' +
      'delicate and festive',
  },
  {
    slug: 'woven-hanging-heart-pair',
    subject:
      'two woven natural palm leaf heart ornaments hanging by loops of twine, one ' +
      'slightly in front of the other, soft cream backdrop, tight decorative weave',
  },
  {
    slug: 'leaf-pomander-set',
    subject:
      'three woven natural palm leaf pomander balls each studded with whole cloves ' +
      'in a neat pattern, one resting in a tiny woven dish, warm rustic tones',
  },
  {
    slug: 'woven-advent-calendar-pockets',
    subject:
      'a woven natural palm leaf hanging advent calendar with twenty-four small ' +
      'numbered pockets arranged in rows, empty, suspended flat against a cream ' +
      'wall, neat tight weave, no legible text',
  },
  {
    slug: 'woven-cupcake-liner-set',
    subject:
      'a set of six small woven natural palm leaf cupcake cups, four holding plain ' +
      'unfrosted cupcakes and two empty, arranged in a loose cluster on cream linen',
  },
  {
    slug: 'woven-egg-basket-six',
    subject:
      'a shallow woven natural palm leaf egg basket with six rounded compartments ' +
      'holding six pale brown eggs, a small woven handle arching over the top, ' +
      'warm straw tones',
  },
  {
    slug: 'woven-cheese-serving-set',
    subject:
      'a woven natural palm leaf serving board with a shallow woven handle and a ' +
      'small matching woven knife rest, a wedge of cheese resting on the board, ' +
      'minimal styling',
  },
  {
    slug: 'palm-leaf-cutlery-tray',
    subject:
      'a rectangular woven natural palm leaf cutlery tray with three shallow ' +
      'compartments holding wooden forks and spoons, laid flat on a cream linen ' +
      'surface, neat even weave',
  },
  {
    slug: 'woven-kitchen-utensil-holder',
    subject:
      'a tall cylindrical woven natural palm leaf kitchen utensil holder with a ' +
      'rolled rim, holding wooden spoons and a whisk, standing on a cream counter',
  },
  {
    slug: 'woven-bedside-pouch',
    subject:
      'a small woven natural palm leaf bedside pouch with a flat woven back and a ' +
      'shallow front pocket, holding a pair of glasses and a paperback book, ' +
      'hanging on a cream wall',
  },
  {
    slug: 'beginner-leaf-weaving-kit-adult',
    subject:
      'a beginner palm leaf weaving kit laid out flat: a neat bundle of pre-cut ' +
      'softened palm leaf strips, a small wooden reed base former, a printed ' +
      'instruction card and a tiny glass jar of finishing oil, on cream linen',
  },
  {
    slug: 'kids-leaf-bracelet-kit',
    subject:
      'pre-folded flat plaited palm and coconut leaf bracelet strips in a loose ' +
      'pile beside two finished woven leaf bracelets, soft pale green and straw ' +
      'tones, on cream linen',
  },
  {
    slug: 'palm-leaf-desk-tidy',
    subject:
      'a woven natural palm leaf desk tidy with a deep pen well holding pencils, ' +
      'a narrow note slot with a folded card and a shallow dish holding paper ' +
      'clips, on a pale wood desk',
  },
  {
    slug: 'leaf-wrapped-pencil-cup',
    subject:
      'a small cylindrical woven natural palm leaf pencil cup holding a handful ' +
      'of wooden pencils and two paintbrushes, standing on a pale wood desk, ' +
      'warm straw tones',
  },
  {
    slug: 'woven-cable-tidy-set',
    subject:
      'a set of three shallow woven natural palm leaf trays in graded sizes ' +
      'arranged overlapping, one holding a coiled charging cable and earbuds, ' +
      'clean minimal desk styling',
  },
  {
    slug: 'woven-kitchen-set',
    subject:
      'a matched three piece woven natural palm leaf kitchen set arranged ' +
      'together: a tall utensil holder with wooden spoons, a three compartment ' +
      'cutlery tray and a wide fruit bowl holding three lemons, on cream linen',
  },
  {
    slug: 'woven-gift-wrap-set',
    subject:
      'a woven natural palm leaf gift wrap set: two lidded woven boxes in graded ' +
      'sizes, one lid set slightly ajar, beside four small woven toppers and a ' +
      'small woven tag pouch, on cream linen',
  },
  {
    slug: 'woven-bathroom-accessory-set',
    subject:
      'a matched three piece woven natural palm leaf bathroom set on cream ' +
      'linen: a slotted soap dish with a bar of soap, a small vanity tray with a ' +
      'candle and a bottle, and a cylinder holding three bottles upright, ' +
      'soft sheen finish',
  },
];

// ---- Auth header -------------------------------------------------
function authHeaders() {
  if (API_TOKEN) return { Authorization: `Bearer ${API_TOKEN}` };
  if (API_KEY && EMAIL) {
    return { 'X-Auth-Key': API_KEY, 'X-Auth-Email': EMAIL };
  }
  throw new Error(
    'No Cloudflare credentials. Set CLOUDFLARE_API_KEY + CLOUDFLARE_EMAIL, or CLOUDFLARE_API_TOKEN.'
  );
}

// ---- Generate ----------------------------------------------------
async function generate(prompt, { retries = 2 } = {}) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${MODEL}`;
  const headers = { ...authHeaders(), 'Content-Type': 'application/json' };
  const body = JSON.stringify({
    prompt,
    steps: 8,
  });

  let lastErr;
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    const res = await fetch(url, { method: 'POST', headers, body });
    const text = await res.text();
    if (!res.ok) {
      lastErr = new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
      if (res.status >= 400 && res.status < 500) throw lastErr; // no point retrying
      await new Promise((r) => setTimeout(r, 1500 * attempt));
      continue;
    }
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      lastErr = new Error(`Unparseable response: ${text.slice(0, 200)}`);
      continue;
    }
    const b64 = json?.result?.image;
    if (!b64) {
      lastErr = new Error(`No image in response: ${text.slice(0, 300)}`);
      await new Promise((r) => setTimeout(r, 1200 * attempt));
      continue;
    }
    return Buffer.from(b64, 'base64');
  }
  throw lastErr;
}

// ---- Main --------------------------------------------------------
const only = (() => {
  const i = process.argv.indexOf('--only');
  return i !== -1 ? process.argv[i + 1] : null;
})();

fs.mkdirSync(RAW_DIR, { recursive: true });

const targets = PRODUCTS.filter((p) => !only || p.slug === only);
if (!targets.length) {
  console.error(`\n  No product matches --only ${only}\n`);
  process.exit(1);
}

console.log(`\n  Generating ${targets.length} product image(s) with ${MODEL}\n`);

for (const p of targets) {
  const prompt = `${p.subject}, ${STYLE}`;
  process.stdout.write(`  ${p.slug} ... `);
  try {
    const buf = await generate(prompt);
    const out = path.join(RAW_DIR, `${p.slug}.png`);
    fs.writeFileSync(out, buf);
    console.log(`ok (${(buf.length / 1024).toFixed(0)} KB)`);

    // Hand off to add-image.js so derivatives match the rest of the catalogue.
    execFileSync(
      process.execPath,
      [path.join(ROOT, 'add-image.js'), out, p.slug, '--group', 'products'],
      { cwd: ROOT, stdio: 'inherit' }
    );
  } catch (err) {
    console.log('FAILED');
    console.error(`    ${err.message}`);
    process.exitCode = 1;
  }
}

console.log('\n  Done.\n');
