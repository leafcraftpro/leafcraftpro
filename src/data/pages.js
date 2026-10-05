/**
 * ============================================================
 *  Static inner pages — about, contact, FAQ, policies and the
 *  craft glossary. These render at /<slug>.
 *  `blocks` uses the same block vocabulary as the blog posts.
 * ============================================================
 */

export const pages = [
  /* ---------------------------------------------------------- */
  {
    slug: 'about',
    title: 'Our Craft Story',
    navTitle: 'About',
    eyebrow: 'Who we are',
    intro:
      'LeafCraftPRO began with a simple idea: that the leaves falling in our gardens every day hold more beauty and usefulness than we give them credit for. We collect them, prepare them, and weave them into baskets, ornaments and home decor. Then we write down exactly how we did it.',
    metaTitle: 'About LeafCraftPRO — Handmade Natural Leaf Crafts',
    metaDescription:
      'Meet the makers behind LeafCraftPRO. We weave handmade objects from palm and coconut leaves and publish every technique as a free, tested step-by-step tutorial.',
    keywords: ['about leafcraftpro', 'handmade leaf crafts', 'natural craft studio', 'palm leaf artisans'],
    heroImage: 'hero/main',
    showInFooter: true,
    showInHeader: true,
    order: 1,
    updatedAt: '2026-08-12',
    blocks: [
      {
        type: 'heading',
        level: 2,
        text: 'How this started',
      },
      {
        type: 'paragraph',
        html:
          '<p>The workshop started on a back porch with a bundle of palm leaves and a stubborn refusal to throw them away. Fifteen years later we still work the same way: gather, soften, weave, trim, and check every piece by hand before it leaves the bench.</p><p>What changed is that we started writing things down. Every technique we were taught, every mistake we made, and every shortcut we found is now published as a free tutorial. If a step is fiddly, we say so. If a material is wrong for a job, we say that too.</p>',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Why natural materials',
      },
      {
        type: 'paragraph',
        html:
          '<p>Palm and coconut leaves are abundant, renewable and completely biodegradable. Working with them produces no plastic waste and keeps a set of traditional weaving skills alive that would otherwise be lost within a generation.</p>',
      },
      {
        type: 'notice',
        tone: 'info',
        text:
          'We are honest about the trade-offs. Natural objects need a little care, they change colour over time, and they will not outlast a plastic tub in a damp shed. We think that is a fair exchange, but it is your call to make — read our comparison guide before you decide.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'How we work',
      },
      {
        type: 'steps',
        title: 'From garden clippings to finished craft',
        items: [
          {
            title: 'Collect',
            text: 'We gather fallen and pruned palm and coconut leaves from local gardens and smallholdings, always with the grower\u2019s permission and never by stripping a tree.',
          },
          {
            title: 'Prepare',
            text: 'Leaves are cleaned, softened in water and cut into strips of consistent width. Consistency here decides whether the finished weave sits flat.',
          },
          {
            title: 'Weave',
            text: 'Each piece is woven by hand following traditional patterns. A small basket takes around two hours; a large laundry basket takes the better part of a day.',
          },
          {
            title: 'Finish',
            text: 'Edges are trimmed, the rim is locked, and the piece is checked against the same list every time before it is packed in plastic-free wrapping.',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'What you will find here',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Fifty in-depth tutorials, from a twenty-minute coaster set to a full laundry basket.',
          'Honest material guides that compare natural and synthetic options without the hype.',
          'A small shop of finished pieces, for anyone who would rather buy than weave.',
          'Every tutorial tested by hand in our own workshop before it is published.',
        ],
      },
      {
        type: 'quote',
        text: 'A basket that looks right on the bench and sags within a week was never finished properly. Tension is everything.',
        cite: 'Theo Nakamura, Workshop Lead',
      },
      {
        type: 'cta',
        title: 'Start with the beginner\u2019s guide',
        text: 'If you have never woven before, this is the article we send everyone to first.',
        buttonText: 'Read the beginner guide',
        buttonLink: '/palm-leaf-weaving-for-beginners',
      },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    slug: 'contact',
    title: 'Contact Us',
    navTitle: 'Contact',
    eyebrow: 'Get in touch',
    intro:
      'Questions about a project, a custom order, or a tutorial that did not quite work for you? We read every message ourselves and usually reply within one working day.',
    metaTitle: 'Contact LeafCraftPRO — Questions, Custom Orders',
    metaDescription:
      'Contact the LeafCraftPRO workshop about a tutorial, a custom woven piece or an order. We reply to every message within one working day.',
    keywords: ['contact leafcraftpro', 'custom woven order', 'craft workshop contact'],
    showInFooter: true,
    showInHeader: true,
    order: 2,
    updatedAt: '2026-08-12',
    blocks: [
      {
        type: 'heading',
        level: 2,
        text: 'Before you write',
      },
      {
        type: 'paragraph',
        html:
          '<p>A lot of common questions already have detailed answers. Checking these first will usually get you a faster answer than waiting for a reply.</p>',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Shipping times, costs and our 30-day return policy are set out in full on the shipping page.',
          'How to care for a woven piece is covered in our care guide.',
          'Where to buy or harvest leaves is answered in the sourcing guide.',
          'Anything about the site, your data or cookies is covered by the privacy policy.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Custom and wholesale work',
      },
      {
        type: 'paragraph',
        html:
          '<p>We take a small number of custom commissions each month: matching sets for a wedding, branded gift boxes for a small business, or a one-off piece to a specific size. Tell us the object, the approximate dimensions, the quantity and the date you need it by, and we will tell you honestly whether we can do it.</p>',
      },
      {
        type: 'notice',
        tone: 'info',
        text: 'Custom pieces typically take two to three weeks. We will always confirm the timeline in writing before you pay anything.',
      },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    slug: 'faq',
    title: 'Frequently Asked Questions',
    navTitle: 'FAQ',
    eyebrow: 'Answers',
    intro:
      'The questions we are asked most often, answered properly. If yours is not here, the contact page is the fastest way to reach us.',
    metaTitle: 'FAQ — Leaf Craft, Shipping, Care and Returns',
    metaDescription:
      'Answers to common questions about leaf craft, our handmade products, shipping, returns, materials and how to care for woven objects.',
    keywords: ['leaf craft faq', 'woven basket care', 'handmade craft questions'],
    showInFooter: true,
    showInHeader: false,
    order: 3,
    updatedAt: '2026-08-12',
    blocks: [
      { type: 'heading', level: 2, text: 'Still stuck?' },
      {
        type: 'paragraph',
        html:
          '<p>If your question is not answered below, write to us through the contact page. Include a photograph if the question is about a specific piece you have made or received \u2014 it makes answering much faster.</p>',
      },
    ],
    faq: [
      {
        q: 'Are your products really handmade?',
        a: 'Yes. Every basket, box and ornament is woven by hand in our own workshop from natural palm and coconut leaves. Because of that, colour, grain and exact dimensions vary slightly between pieces \u2014 those variations are a feature of handmade work, not a defect.',
      },
      {
        q: 'How long does shipping take?',
        a: 'Orders are packed and dispatched within one to two business days. Domestic delivery is typically three to five business days, and international delivery is seven to fourteen business days. Tracking is included on every order.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes, on all orders over $50. The discount is applied automatically at checkout, with no code needed.',
      },
      {
        q: 'Can I return an item?',
        a: 'You have thirty days from delivery to return any unused item in its original condition for a full refund. Custom and personalised pieces cannot be returned unless they are faulty. Return shipping is your responsibility unless the item arrived damaged.',
      },
      {
        q: 'Will the colour change over time?',
        a: 'It will. Fresh green leaves gradually fade to a warm straw tone as they dry. This is normal and, in our view, part of the charm. Keeping a piece out of prolonged direct sunlight slows the change considerably.',
      },
      {
        q: 'Are the products waterproof?',
        a: 'They are water resistant, not waterproof. A woven piece will handle a damp cloth and an accidental splash, but it should not be soaked or left sitting in water. Use a liner or a plant saucer where moisture is likely.',
      },
      {
        q: 'Are your tutorials free?',
        a: 'Every tutorial on the site is free to read, with no account required. You are welcome to make items from our guides for yourself or as gifts. Commercial use of our patterns and photographs requires written permission.',
      },
      {
        q: 'What ages are the kids craft projects suitable for?',
        a: 'Most projects are suitable from around age six with close adult supervision, and from age ten with light supervision. Every kids project page lists an age recommendation and the specific safety points for that activity.',
      },
      {
        q: 'Can I sell items I make from your tutorials?',
        a: 'For personal use and gifts, yes, freely. For commercial resale of items made from our patterns, email us first \u2014 we usually say yes for small-scale makers, and we prefer to give permission explicitly rather than leave it ambiguous.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes. International shipping is calculated at checkout and typically takes seven to fourteen business days. Any customs duties or import taxes are the responsibility of the recipient.',
      },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    slug: 'shipping-returns',
    title: 'Shipping & Returns',
    navTitle: 'Shipping & Returns',
    eyebrow: 'Orders',
    intro:
      'How we pack, how long delivery takes, and exactly what happens if something is not right.',
    metaTitle: 'Shipping and Returns — LeafCraftPRO',
    metaDescription:
      'Shipping times, costs and our 30-day return policy explained. Free shipping on orders over $50, plastic-free packaging and tracked delivery on every order.',
    keywords: ['shipping policy', 'returns policy', 'free shipping handmade'],
    showInFooter: true,
    showInHeader: false,
    order: 4,
    updatedAt: '2026-08-12',
    blocks: [
      { type: 'heading', level: 2, text: 'Processing time' },
      {
        type: 'paragraph',
        html:
          '<p>Orders are packed and dispatched within one to two business days. Because every piece is handmade and some are woven to order, occasional items take longer \u2014 where that is the case, the product page will say so before you buy.</p>',
      },
      { type: 'heading', level: 2, text: 'Delivery estimates' },
      {
        type: 'table',
        head: ['Destination', 'Service', 'Estimated time', 'Cost'],
        rows: [
          ['Domestic', 'Standard tracked', '3\u20135 business days', '$5.00'],
          ['Domestic', 'Express tracked', '1\u20132 business days', '$15.00'],
          ['Domestic', 'Free shipping', '5\u20137 business days', 'Free over $50'],
          ['International', 'Tracked', '7\u201314 business days', 'Calculated at checkout'],
        ],
      },
      { type: 'heading', level: 2, text: 'Packaging' },
      {
        type: 'paragraph',
        html:
          '<p>We use plastic-free, biodegradable packaging wherever it is practical. Boxes are recycled cardboard, void fill is paper, and tape is paper-based. If a piece needs protection for a long journey we use recycled corrugated card rather than bubble wrap.</p>',
      },
      {
        type: 'notice',
        tone: 'success',
        text: 'Every order includes tracking, and you will receive a dispatch email with the tracking link the moment your parcel leaves the workshop.',
      },
      { type: 'heading', level: 2, text: 'Returns' },
      {
        type: 'paragraph',
        html:
          '<p>You have thirty days from delivery to return any unused item in its original condition for a full refund. Return shipping is your responsibility unless the item arrived damaged or faulty.</p><p>Custom and personalised pieces cannot be returned unless faulty, because they cannot be resold.</p>',
      },
      { type: 'heading', level: 2, text: 'Damaged or incorrect items' },
      {
        type: 'paragraph',
        html:
          '<p>If something arrives damaged, or is not what you ordered, email us within seven days of delivery with a photograph of the item and the packaging. We will replace it or refund you in full \u2014 you will not be asked to pay return postage in either case.</p>',
      },
      {
        type: 'cta',
        title: 'Something not right with your order?',
        text: 'Send us a message with your order number and we will sort it out.',
        buttonText: 'Contact the workshop',
        buttonLink: '/contact',
      },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    navTitle: 'Privacy Policy',
    eyebrow: 'Legal',
    intro:
      'How we collect, use and protect your personal information when you visit this site or place an order.',
    metaTitle: 'Privacy Policy — LeafCraftPRO',
    metaDescription:
      'How LeafCraftPRO collects, uses and protects your personal data, including what we store, how long we keep it, and the rights you have over your information.',
    keywords: ['privacy policy', 'data protection', 'gdpr'],
    showInFooter: true,
    showInHeader: false,
    order: 5,
    updatedAt: '2026-08-12',
    blocks: [
      { type: 'heading', level: 2, text: 'Information we collect' },
      {
        type: 'paragraph',
        html:
          '<p>We collect the information you give us directly: your name, email address, phone number and delivery address when you place an order, and whatever you write when you contact us through the contact form.</p><p>We also collect a limited amount of technical data automatically, such as your IP address and browser type, for security, fraud prevention and aggregate analytics.</p>',
      },
      { type: 'heading', level: 2, text: 'How we use your information' },
      {
        type: 'list',
        ordered: false,
        items: [
          'To process, pack and deliver your order, and to send you order and dispatch confirmations.',
          'To answer your questions and resolve problems with an order.',
          'To send you our newsletter \u2014 only if you have actively opted in, and only until you unsubscribe.',
          'To detect and prevent fraudulent orders and abuse of the site.',
        ],
      },
      { type: 'heading', level: 2, text: 'Cookies' },
      {
        type: 'paragraph',
        html:
          '<p>This site is served as static pages and does not set advertising or tracking cookies by default. Any analytics that may be enabled by the site owner are configured to respect the Do Not Track header. If a third-party analytics service is enabled, it is listed in the cookie policy.</p>',
      },
      { type: 'heading', level: 2, text: 'Sharing your information' },
      {
        type: 'paragraph',
        html:
          '<p>We never sell your personal data. We share it only with the delivery partners and payment providers needed to fulfil your order, and with authorities where the law requires it.</p>',
      },
      { type: 'heading', level: 2, text: 'How long we keep it' },
      {
        type: 'table',
        head: ['Data', 'Retention period'],
        rows: [
          ['Order records', '7 years, as required for tax and accounting'],
          ['Contact form messages', '24 months'],
          ['Newsletter subscription', 'Until you unsubscribe'],
          ['Server logs', '30 days'],
        ],
      },
      { type: 'heading', level: 2, text: 'Your rights' },
      {
        type: 'paragraph',
        html:
          '<p>You may request access to, correction of, or deletion of your personal data at any time. You may also object to processing, request a portable copy of your data, or withdraw consent for marketing. Email us and we will respond within thirty days.</p>',
      },
      {
        type: 'notice',
        tone: 'info',
        text: 'This site is a static website with no database. Order and contact data is handled by the third-party services named in this policy rather than stored on the web server itself.',
      },
      { type: 'heading', level: 2, text: 'Children\u2019s privacy' },
      {
        type: 'paragraph',
        html:
          '<p>This site is not directed at children under thirteen, and we do not knowingly collect their personal data. Our kids craft tutorials are written for parents and carers to read and lead.</p>',
      },
      { type: 'heading', level: 2, text: 'Changes to this policy' },
      {
        type: 'paragraph',
        html:
          '<p>If we change this policy we will update the date at the bottom of the page. Material changes affecting how we use your data will be announced on the site.</p>',
      },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    navTitle: 'Terms',
    eyebrow: 'Legal',
    intro:
      'The terms that apply when you use this website, read our tutorials or place an order with us.',
    metaTitle: 'Terms and Conditions — LeafCraftPRO',
    metaDescription:
      'The terms governing use of the LeafCraftPRO website, our free tutorials, and the purchase of handmade products, including pricing, delivery and returns.',
    keywords: ['terms and conditions', 'website terms', 'purchase terms'],
    showInFooter: true,
    showInHeader: false,
    order: 6,
    updatedAt: '2026-08-12',
    blocks: [
      { type: 'heading', level: 2, text: 'Using this website' },
      {
        type: 'paragraph',
        html:
          '<p>By using this site you agree to these terms. If you do not agree with them, please do not use the site. We may update these terms from time to time; the version published at the time of your order is the version that applies to it.</p>',
      },
      { type: 'heading', level: 2, text: 'Tutorials and intellectual property' },
      {
        type: 'paragraph',
        html:
          '<p>All tutorial text, photographs and product designs on this site are protected by copyright and belong to LeafCraftPRO. You are welcome to make items from our tutorials for personal use and as gifts.</p><p>Republishing our tutorials, in whole or in part, or using our photographs without written permission is not allowed. Commercial resale of items made from our patterns requires our written consent.</p>',
      },
      { type: 'heading', level: 2, text: 'Products and descriptions' },
      {
        type: 'paragraph',
        html:
          '<p>All of our products are handmade from natural materials, so colour, grain, shape and exact dimensions vary slightly between items. We describe every product as accurately as we can, and measurements are given in centimetres. The variations that come from working with a natural material are a feature of handmade work, not a defect.</p>',
      },
      { type: 'heading', level: 2, text: 'Pricing and payment' },
      {
        type: 'paragraph',
        html:
          '<p>All prices are shown in US dollars and include any applicable taxes unless stated otherwise. Payment must be received in full before dispatch. We reserve the right to correct pricing errors and to cancel and refund an order placed at an obviously incorrect price.</p>',
      },
      { type: 'heading', level: 2, text: 'Delivery and risk' },
      {
        type: 'paragraph',
        html:
          '<p>Delivery timescales are estimates, not guarantees. Risk in the goods passes to you on delivery. If a parcel is lost in transit we will replace it at our cost.</p>',
      },
      { type: 'heading', level: 2, text: 'Returns' },
      {
        type: 'paragraph',
        html:
          '<p>Unused items may be returned within thirty days of delivery for a refund. Custom and personalised pieces cannot be returned unless faulty. Full details are on the shipping and returns page.</p>',
      },
      { type: 'heading', level: 2, text: 'Health, safety and craft guidance' },
      {
        type: 'notice',
        tone: 'warning',
        text:
          'Our tutorials are provided as general guidance only. Craft involves sharp tools and, in some projects, heat. You are responsible for working safely, using appropriate protective equipment, and supervising any child taking part.',
      },
      {
        type: 'paragraph',
        html:
          '<p>We test every technique ourselves, but we cannot guarantee the outcome of a project made by someone else, with different materials, in a different environment. Any reliance you place on our guidance is at your own risk.</p>',
      },
      { type: 'heading', level: 2, text: 'Limitation of liability' },
      {
        type: 'paragraph',
        html:
          '<p>To the fullest extent permitted by law, our liability in connection with any order is limited to the amount you paid for that order. Nothing in these terms limits liability for death or personal injury caused by negligence, or for fraud.</p>',
      },
      { type: 'heading', level: 2, text: 'Governing law' },
      {
        type: 'paragraph',
        html:
          '<p>These terms are governed by the laws of the State of Oregon, United States, and any dispute will be subject to the exclusive jurisdiction of the courts of that state.</p>',
      },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    navTitle: 'Cookie Policy',
    eyebrow: 'Legal',
    intro:
      'What cookies and similar technologies this site uses, why, and how to control them.',
    metaTitle: 'Cookie Policy — LeafCraftPRO',
    metaDescription:
      'A plain explanation of the cookies this site uses, which are strictly necessary, which are optional, and how to control or delete them in your browser.',
    keywords: ['cookie policy', 'cookies', 'tracking'],
    showInFooter: true,
    showInHeader: false,
    order: 7,
    updatedAt: '2026-08-12',
    blocks: [
      { type: 'heading', level: 2, text: 'What a cookie is' },
      {
        type: 'paragraph',
        html:
          '<p>A cookie is a small text file that a website asks your browser to store. It lets the site remember something about you between page loads \u2014 for example, whether you have dismissed a banner.</p>',
      },
      { type: 'heading', level: 2, text: 'What this site uses' },
      {
        type: 'table',
        head: ['Category', 'Purpose', 'Set by', 'Consent needed'],
        rows: [
          ['Strictly necessary', 'Remembering your preferences and keeping forms working securely', 'This site', 'No'],
          ['Analytics', 'Counting visits so we know which tutorials are useful', 'Optional third party', 'Yes'],
          ['Advertising', 'Not used on this site', '\u2014', '\u2014'],
        ],
      },
      {
        type: 'notice',
        tone: 'info',
        text:
          'This site is served as static files and does not run a database or an advertising network. No advertising cookies are set.',
      },
      { type: 'heading', level: 2, text: 'Controlling cookies' },
      {
        type: 'paragraph',
        html:
          '<p>Every major browser lets you view, block and delete cookies in its settings. Blocking strictly necessary cookies may stop parts of the site from working correctly. Because we do not use advertising cookies, there is no third-party ad profile to opt out of here.</p>',
      },
      { type: 'heading', level: 2, text: 'Do Not Track' },
      {
        type: 'paragraph',
        html:
          '<p>If your browser sends a Do Not Track signal, any optional analytics on this site will not be loaded.</p>',
      },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    slug: 'accessibility',
    title: 'Accessibility',
    navTitle: 'Accessibility',
    eyebrow: 'Our commitment',
    intro:
      'What we have done to make this site usable by as many people as possible, and how to tell us when we have fallen short.',
    metaTitle: 'Accessibility Statement — LeafCraftPRO',
    metaDescription:
      'Our accessibility commitment: the standards this site targets, the features we have built in, known limitations, and how to report an accessibility problem.',
    keywords: ['accessibility statement', 'wcag', 'web accessibility'],
    showInFooter: true,
    showInHeader: false,
    order: 8,
    updatedAt: '2026-08-12',
    blocks: [
      { type: 'heading', level: 2, text: 'Our target' },
      {
        type: 'paragraph',
        html:
          '<p>We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA across the whole site. Accessibility is treated as part of the build, not a retrofit: every page is written with semantic landmarks, and every component is checked with a keyboard before it ships.</p>',
      },
      { type: 'heading', level: 2, text: 'What we have built in' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Semantic HTML landmarks and a skip-to-content link on every page.',
          'Full keyboard operability, including the navigation menu, search overlay and image gallery.',
          'Visible focus indicators that meet contrast requirements.',
          'Alt text on every meaningful image, with decorative images marked as such.',
          'Body text that meets AA contrast against its background, and text that reflows without loss at 200 percent zoom.',
          'Respect for the operating system reduced-motion setting \u2014 all animation is disabled when it is enabled.',
          'Touch targets of at least 44 by 44 pixels on interactive controls.',
        ],
      },
      { type: 'heading', level: 2, text: 'Known limitations' },
      {
        type: 'paragraph',
        html:
          '<p>Some of our older photographs show fine woven textures that are difficult to describe precisely in alt text. Where a texture matters to understanding the content, we describe it in the surrounding prose instead.</p>',
      },
      { type: 'heading', level: 2, text: 'Tell us about a problem' },
      {
        type: 'paragraph',
        html:
          '<p>If you hit a barrier anywhere on this site, email us with the page address and a short description of the problem. We treat accessibility reports as bugs and aim to fix them within two weeks.</p>',
      },
      {
        type: 'cta',
        title: 'Found an accessibility problem?',
        text: 'Tell us the page and what went wrong. We will fix it.',
        buttonText: 'Report an issue',
        buttonLink: '/contact',
      },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    slug: 'craft-glossary',
    title: 'Leaf Craft Glossary',
    navTitle: 'Craft Glossary',
    eyebrow: 'Reference',
    intro:
      'Every term we use in our tutorials, defined once and properly. Bookmark this page \u2014 it makes the other guides much easier to follow.',
    metaTitle: 'Leaf Craft Glossary: Weaving Terms Explained',
    metaDescription:
      'A plain-English glossary of leaf craft and basket weaving terms, from warp and weft to tension, rim lock, spine and softening, each defined with an example.',
    keywords: ['leaf craft glossary', 'weaving terms', 'basket weaving dictionary'],
    showInFooter: true,
    showInHeader: false,
    order: 9,
    updatedAt: '2026-08-12',
    blocks: [
      {
        type: 'paragraph',
        html:
          '<p>Weaving has a vocabulary that is centuries old and, in places, genuinely confusing \u2014 partly because different regions use different words for the same thing. This is the glossary we use consistently across every tutorial on this site.</p>',
      },
      { type: 'heading', level: 2, text: 'Materials' },
      {
        type: 'table',
        head: ['Term', 'What it means'],
        rows: [
          ['Spine', 'The stiff central rib running down the length of a palm leaf. Usually removed before weaving because it does not bend.'],
          ['Leaflet', 'One of the narrow blades attached to the spine. Most weaving uses the leaflets, not the whole leaf.'],
          ['Strip', 'A leaflet that has been split to a consistent width, typically 5 to 12 mm, ready for weaving.'],
          ['Softening', 'Soaking or steaming strips so they bend without cracking. Fresh leaves need minutes; dried leaves need hours.'],
          ['Sizing', 'Sorting strips by width and thickness so a single piece uses consistent material.'],
          ['Curing', 'Letting a finished piece dry slowly in the shade so it holds its shape without becoming brittle.'],
        ],
      },
      { type: 'heading', level: 2, text: 'Weaving structure' },
      {
        type: 'table',
        head: ['Term', 'What it means'],
        rows: [
          ['Warp', 'The strips that stand upright and form the skeleton of the piece.'],
          ['Weft', 'The strips woven horizontally through the warp. Also called the weaver.'],
          ['Over-under weave', 'The basic pattern: each weft passes alternately over and under each warp. Also called plain weave.'],
          ['Twill', 'A weave where the weft passes over two warps and under one, producing a diagonal pattern.'],
          ['Tension', 'How tightly the weft is pulled. Even tension is the single biggest factor in whether a basket stays square.'],
          ['Slope', 'The natural outward flare of a basket wall. A controlled slope keeps the rim wide and the base stable.'],
        ],
      },
      { type: 'heading', level: 2, text: 'Finishing' },
      {
        type: 'table',
        head: ['Term', 'What it means'],
        rows: [
          ['Rim lock', 'The final row, folded over the row below and tucked in, which stops the whole piece unravelling.'],
          ['Tucking', 'Pushing a loose strip end back into the weave so it is hidden and held.'],
          ['Paring', 'Trimming a tucked end flush so it does not snag.'],
          ['Lashing', 'Binding a rim or handle with a separate cord for extra strength.'],
          ['Handle wrap', 'Winding cord or soft leaf around a handle to make it comfortable to hold.'],
        ],
      },
      {
        type: 'notice',
        tone: 'info',
        text:
          'One term, two meanings: in the United States "weaver" usually means the horizontal strip, while in parts of Asia it refers to the person doing the weaving. We use it only for the strip.',
      },
      {
        type: 'cta',
        title: 'Put the vocabulary to work',
        text: 'The beginner guide walks through every one of these terms in practice.',
        buttonText: 'Read the beginner guide',
        buttonLink: '/palm-leaf-weaving-for-beginners',
      },
    ],
  },
];

export const getPage = (slug) => pages.find((p) => p.slug === slug) || null;

export const footerPages = pages
  .filter((p) => p.showInFooter)
  .sort((a, b) => a.order - b.order);

export default pages;
