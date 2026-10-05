// src/data/products.js
// LeafCraftPRO product catalogue. Handmade objects woven from natural palm
// and coconut leaves. Plain ASCII only, no emoji, ES module default export.

export default [
  // ------------------------------------------------------------------
  // 1. Classic Palm Leaf Basket
  // ------------------------------------------------------------------
  {
    slug: "classic-palm-leaf-basket",
    name: "Classic Palm Leaf Basket",
    category: "baskets",
    sku: "LC-BSK-001",
    price: 24.0,
    salePrice: 18.0,
    stock: 24,
    stockStatus: "in_stock",
    badge: "Best Seller",
    rating: 4.8,
    reviewCount: 24,
    featured: true,
    shortDescription:
      "The basket we teach everyone to weave first. A tight over-under body, a folded rim that hides every loose end, and a shape that holds itself up on a shelf or a kitchen table every day.",
    metaTitle: "Classic Palm Leaf Basket | LeafCraftPRO",
    metaDescription:
      "Classic handwoven palm leaf basket with a folded rim and a tight over-under weave. Holds its shape when empty, ships plastic-free and is fully compostable.",
    keywords: [
      "palm leaf basket",
      "handwoven basket",
      "natural storage basket",
      "woven basket",
      "eco friendly basket",
    ],
    tags: ["handmade", "storage"],
    material: "Natural palm leaf",
    weight: "250 g",
    dimensions: "20 x 20 x 15 cm",
    colour: "Fresh green fading to warm straw",
    care: "Dust with a soft dry brush and keep it out of prolonged direct sunlight.",
    features: [
      "Woven by hand from fresh palm leaves",
      "Tight over-under weave holds its shape",
      "Folded rim hides every loose end",
      "Plastic-free packaging",
      "Compostable at end of life",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>This is the basket Maya has taught for fifteen years, and the one we still make most often. It begins as a flat square of woven leaf and grows upward, row by row, until the sides stand on their own. Nothing is glued and nothing is stapled. The rim is folded back into the weave so the basket finishes itself.</p>",
      },
      { type: "heading", level: 3, text: "How it is made" },
      {
        type: "paragraph",
        html: "<p>Fresh palm leaflets are cut into even strips and softened in clean water for ten minutes, then woven damp so the fibres stay pliable. Each basket takes about two and a half hours at the bench. As the leaves dry over the following days they tighten, and the basket becomes firmer than it felt in the hand.</p>",
      },
      {
        type: "list",
        items: [
          "Holds fruit, bread, keys or folded linens",
          "Sits flat on a shelf without tipping",
          "Light enough to carry with one hand",
          "Gets firmer as the leaf dries",
        ],
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Weave", "Tight over-under, folded rim"],
          ["Base", "20 x 20 cm square"],
          ["Height", "15 cm"],
          ["Finish", "Untreated natural leaf"],
        ],
      },
      {
        type: "notice",
        tone: "info",
        text: "Because every leaf is different, the tone and grain of your basket will not match the photo exactly. That variation is the signature of a genuinely handmade object.",
      },
      {
        type: "quote",
        text: "The first row is the whole basket. Get the tension even there and the rest follows.",
      },
      {
        type: "paragraph",
        html: "<p>Use it every day and it will darken gently toward straw. Keep it dry, brush off crumbs, and it will last for years.</p>",
      },
    ],
    images: ["classic-palm-leaf-basket"],
    reviews: [
      {
        name: "Amelia R.",
        rating: 5,
        date: "2026-03-02",
        text: "Beautifully made and far sturdier than I expected. It holds onions and garlic on the counter and has kept its shape perfectly.",
      },
      {
        name: "Daniel K.",
        rating: 5,
        date: "2026-01-19",
        text: "Bought two as gifts and kept one. The weave is tight and even and the rim is finished so neatly there is nothing scratchy anywhere.",
      },
      {
        name: "Priya N.",
        rating: 4,
        date: "2025-11-08",
        text: "Lovely natural colour and a good size. Slightly smaller than I pictured, but the quality is obvious and it arrived in paper packaging only.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 2. Deep Storage Basket
  // ------------------------------------------------------------------
  {
    slug: "deep-storage-basket",
    name: "Deep Storage Basket with Rope Handles",
    category: "baskets",
    sku: "LC-BSK-002",
    price: 38.0,
    salePrice: null,
    stock: 18,
    stockStatus: "in_stock",
    badge: "Workshop Favourite",
    rating: 4.7,
    reviewCount: 31,
    featured: true,
    shortDescription:
      "A tall, upright basket built to swallow blankets, magazines or toys. Two hand-twisted cotton rope handles are spliced through the wall so they never pull loose, however heavy the load gets.",
    metaTitle: "Deep Storage Basket with Rope Handles",
    metaDescription:
      "Tall handwoven palm leaf storage basket with spliced cotton rope handles. Holds blankets and toys, keeps its upright shape and ships without any plastic.",
    keywords: [
      "deep storage basket",
      "tall woven basket",
      "palm leaf storage",
      "basket with handles",
      "blanket basket",
    ],
    tags: ["handmade", "storage", "large"],
    material: "Palm leaf and cotton cord",
    weight: "620 g",
    dimensions: "32 x 32 x 38 cm",
    colour: "Golden straw with pale rope trim",
    care: "Dust with a soft dry brush and reshape by hand if the sides soften over time.",
    features: [
      "Two spliced cotton rope handles",
      "Stands upright even when half full",
      "Holds blankets, toys or magazines",
      "Reinforced base for heavier loads",
      "Plastic-free packaging",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>Most deep baskets sag at the rim once they carry weight. This one does not, because the top three rows are woven tighter than the body and the rim is doubled back on itself. It is the basket we keep beside the sofa for blankets and it takes the abuse well.</p>",
      },
      { type: "heading", level: 3, text: "The handles" },
      {
        type: "paragraph",
        html: "<p>The handles are hand-twisted cotton cord, not glued-on loops. Each end is spliced through two layers of weave and knotted inside, so the pull is spread across the wall instead of a single point. Lift a full basket and nothing stretches.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Weave", "Over-under body, reinforced rim"],
          ["Handles", "Twisted cotton cord, spliced"],
          ["Base", "32 x 32 cm, doubled"],
          ["Height", "38 cm"],
        ],
      },
      {
        type: "list",
        items: [
          "Blankets and throws",
          "Children's toys and blocks",
          "Magazines and newspapers",
          "Towels in a guest room",
        ],
      },
      {
        type: "notice",
        tone: "warning",
        text: "This is a dry-goods basket. Do not use it for damp laundry, because prolonged moisture will soften the leaf and stain the rope.",
      },
      {
        type: "quote",
        text: "A basket earns its keep when it still looks good after the third winter of blankets.",
      },
    ],
    images: ["deep-storage-basket"],
    reviews: [
      {
        name: "Hannah B.",
        rating: 5,
        date: "2026-02-11",
        text: "It is genuinely big and the handles are the reason I bought it. I can carry a full load of washing to the line without the basket flexing.",
      },
      {
        name: "Marco T.",
        rating: 5,
        date: "2025-12-03",
        text: "Well made and the rope handles feel solid. The weave is slightly rustic which I like, and it has held its shape with heavy magazines inside.",
      },
      {
        name: "Elin S.",
        rating: 4,
        date: "2025-09-27",
        text: "Very roomy and attractive. It took a couple of days for the fresh-leaf smell to fade, but after that it has been perfect by the fireplace.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 3. Shallow Bread Basket
  // ------------------------------------------------------------------
  {
    slug: "shallow-bread-basket",
    name: "Shallow Bread Basket",
    category: "baskets",
    sku: "LC-BSK-003",
    price: 26.0,
    salePrice: null,
    stock: 22,
    stockStatus: "in_stock",
    badge: "",
    rating: 4.6,
    reviewCount: 19,
    featured: false,
    shortDescription:
      "A wide, low basket with an open lattice base that lets warm bread breathe instead of sweating. Woven flat enough to sit in the middle of the table without hiding the food. Serve straight from it and the crust stays crisp.",
    metaTitle: "Shallow Woven Bread Basket | LeafCraftPRO",
    metaDescription:
      "Low handwoven palm leaf bread basket with a breathable open base. Keeps crusts crisp on the table, stacks flat and comes in fully plastic-free packaging.",
    keywords: [
      "bread basket",
      "woven bread basket",
      "palm leaf basket",
      "table basket",
      "natural bread warmer",
    ],
    tags: ["handmade", "kitchen"],
    material: "Natural palm leaf",
    weight: "180 g",
    dimensions: "28 x 18 x 7 cm",
    colour: "Pale straw with soft green edges",
    care: "Shake out crumbs and wipe with a barely damp cloth, then let it air dry fully.",
    features: [
      "Open lattice base lets bread breathe",
      "Wide and low so it does not hide food",
      "Sits flat and stacks neatly",
      "Lined rim for a soft edge",
      "Compostable at end of life",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>Bread goes stale fastest when it cannot breathe. A sealed container traps steam and softens a good crust within hours, which is why this basket leaves the base deliberately open. Air moves under the loaf as well as around it.</p>",
      },
      { type: "heading", level: 3, text: "Why the base is open" },
      {
        type: "paragraph",
        html: "<p>We weave the floor of this basket in a loose lattice, leaving gaps of about a centimetre between the strips. It looks delicate but the rim carries all the strength, so the open base never sags. Line it with a linen cloth if you are serving something small like rolls.</p>",
      },
      {
        type: "list",
        items: [
          "A round sourdough or a small loaf",
          "Warm rolls straight from the oven",
          "Flatbreads and crackers",
          "Fruit on a breakfast table",
        ],
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Base", "Open lattice weave"],
          ["Shape", "Oval, 28 x 18 cm"],
          ["Depth", "7 cm"],
          ["Rim", "Doubled and tucked"],
        ],
      },
      {
        type: "notice",
        tone: "info",
        text: "A fresh loaf straight from the oven is fine here, but let it cool for ten minutes first so the leaf is not steamed from below.",
      },
      {
        type: "paragraph",
        html: "<p>When it is not holding bread it makes a good fruit dish, a tidy home for napkins, or a shallow tray for the coffee table.</p>",
      },
    ],
    images: ["shallow-bread-basket"],
    reviews: [
      {
        name: "Sofia M.",
        rating: 5,
        date: "2026-04-06",
        text: "The open base really does keep the crust crisp. It looks lovely on the table and the low shape means you can still see everyone across it.",
      },
      {
        name: "Tom H.",
        rating: 4,
        date: "2026-02-22",
        text: "Nice and light with a tidy finish. I use it for rolls at the weekend. One strip on the base was slightly wider, which is charming rather than a fault.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 4. Woven Fruit Bowl
  // ------------------------------------------------------------------
  {
    slug: "woven-fruit-bowl",
    name: "Woven Fruit Bowl",
    category: "baskets",
    sku: "LC-BSK-004",
    price: 29.0,
    salePrice: 23.0,
    stock: 26,
    stockStatus: "in_stock",
    badge: "Best Seller",
    rating: 4.9,
    reviewCount: 42,
    featured: true,
    shortDescription:
      "A round, gently cupped bowl that lets fruit ripen evenly in the air. The walls curve in at the rim so apples and oranges settle instead of rolling onto the table. Woven as one seamless spiral.",
    metaTitle: "Woven Palm Leaf Fruit Bowl | LeafCraftPRO",
    metaDescription:
      "Round handwoven palm leaf fruit bowl with a curved rim that holds fruit steady. Breathable sides keep produce fresh and the whole bowl is compostable.",
    keywords: [
      "woven fruit bowl",
      "palm leaf fruit bowl",
      "natural fruit basket",
      "handmade bowl",
      "kitchen storage",
    ],
    tags: ["handmade", "kitchen", "gift"],
    material: "Natural palm leaf",
    weight: "210 g",
    dimensions: "26 x 26 x 11 cm",
    colour: "Warm straw with darker woven bands",
    care: "Wipe clean with a dry cloth and avoid leaving wet fruit sitting in it overnight.",
    features: [
      "Curved rim holds fruit steady",
      "Breathable sides keep produce fresh",
      "Round and stable on any surface",
      "Deep enough for a full week of fruit",
      "Plastic-free packaging",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>Fruit keeps longer when air can move around it, and it looks better piled in something round. This bowl is woven in a single spiral from the centre outward, so there is no seam and no weak corner where a base would normally be joined.</p>",
      },
      { type: "heading", level: 3, text: "A bowl with no seam" },
      {
        type: "paragraph",
        html: "<p>We start with one long strip and coil it around itself, adding new strips as we go. The joins are tucked under the row above so they disappear. That continuous spiral is slower to make than a flat base, but it gives the bowl a smooth inside and even strength all the way around.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Technique", "Continuous spiral coil"],
          ["Diameter", "26 cm"],
          ["Depth", "11 cm"],
          ["Rim", "Curved inward"],
        ],
      },
      {
        type: "list",
        items: [
          "Apples, oranges and lemons",
          "Bananas kept separate from the rest",
          "Tomatoes on a counter",
          "A ball of yarn or folded cloths",
        ],
      },
      {
        type: "notice",
        tone: "success",
        text: "This is our most gifted basket. If you are sending it straight to someone else, we will include a hand-written card at no charge.",
      },
      {
        type: "quote",
        text: "A fruit bowl should look like it grew that way. Ours very nearly does.",
      },
      {
        type: "paragraph",
        html: "<p>Over a year or two the green fades fully to straw. The bowl does not weaken, it simply ripens, much like the fruit it holds.</p>",
      },
    ],
    images: ["woven-fruit-bowl"],
    reviews: [
      {
        name: "Grace L.",
        rating: 5,
        date: "2026-03-18",
        text: "I get compliments on this constantly. It is a good size for a family and the curve at the top really does stop the fruit rolling around.",
      },
      {
        name: "Oliver P.",
        rating: 5,
        date: "2026-01-30",
        text: "Second one I have bought, the first was a gift. Smooth inside, no scratchy bits, and it feels much lighter than it looks.",
      },
      {
        name: "Renata C.",
        rating: 5,
        date: "2025-10-14",
        text: "Sturdy, natural and well finished. It replaced a ceramic bowl and honestly looks warmer on the counter. Very happy with it.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 5. Oval Market Basket
  // ------------------------------------------------------------------
  {
    slug: "oval-market-basket",
    name: "Oval Market Basket",
    category: "baskets",
    sku: "LC-BSK-005",
    price: 34.0,
    salePrice: null,
    stock: 15,
    stockStatus: "in_stock",
    badge: "New",
    rating: 4.5,
    reviewCount: 12,
    featured: false,
    shortDescription:
      "An oval basket with a single arched handle, shaped to carry against the hip on the walk home from the market. Deep enough for a week of vegetables, light enough to forget you are holding it.",
    metaTitle: "Oval Market Basket with Handle",
    metaDescription:
      "Handwoven oval palm leaf market basket with one arched carry handle. Deep, light and shaped to rest against the hip for the walk home from the shops.",
    keywords: [
      "market basket",
      "oval basket",
      "basket with handle",
      "palm leaf market basket",
      "shopping basket",
    ],
    tags: ["handmade", "shopping", "storage"],
    material: "Natural palm leaf",
    weight: "390 g",
    dimensions: "36 x 24 x 22 cm",
    colour: "Olive green maturing to hay",
    care: "Dust with a soft dry brush and hang it by the handle to store.",
    features: [
      "Single arched handle, comfortable to carry",
      "Oval shape rests against the hip",
      "Deep enough for a week of vegetables",
      "Reinforced rim around the handle join",
      "Compostable at end of life",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>Market baskets have carried vegetables for centuries, and the shape has barely changed because it works. An oval sits against your side instead of banging your leg, and one handle leaves the other hand free for a list or a child.</p>",
      },
      { type: "heading", level: 3, text: "Built around the handle" },
      {
        type: "paragraph",
        html: "<p>The handle is woven first, as a stiff arch, and the basket is then built up around it. This is the reverse of how a decorative handle is usually added, and it means the load hangs from the weave itself rather than from two small attachment points that could eventually fray.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Shape", "Oval, 36 x 24 cm"],
          ["Depth", "22 cm"],
          ["Handle", "Single arched, woven in"],
          ["Rim", "Doubled for strength"],
        ],
      },
      {
        type: "list",
        items: [
          "Vegetables and a bag of greens",
          "Picnic supplies for two",
          "A knitting project and its wool",
          "Books returned to the library",
        ],
      },
      {
        type: "notice",
        tone: "info",
        text: "This is a new shape for us, released this season. We are making them in small batches, so stock moves quickly.",
      },
      {
        type: "quote",
        text: "A basket you can carry all day without thinking about it is a basket you will actually use.",
      },
    ],
    images: ["oval-market-basket"],
    reviews: [
      {
        name: "Fiona D.",
        rating: 5,
        date: "2026-05-02",
        text: "Perfect for the farmers market. The handle is smooth and the oval shape is so much easier to carry than a round basket.",
      },
      {
        name: "Sam W.",
        rating: 4,
        date: "2026-03-27",
        text: "Light, roomy and nicely made. I wish it were a touch deeper for tall greens, but it holds a surprising amount and looks great.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 6. Small Gift Basket
  // ------------------------------------------------------------------
  {
    slug: "small-gift-basket",
    name: "Small Gift Basket",
    category: "baskets",
    sku: "LC-BSK-006",
    price: 14.0,
    salePrice: null,
    stock: 40,
    stockStatus: "in_stock",
    badge: "",
    rating: 4.4,
    reviewCount: 16,
    featured: false,
    shortDescription:
      "A palm-sized basket with a low, open top, made to present a gift and then keep earning its place on a desk. Small enough for soap, seed packets or a jar of honey. Weave it into your gift wrapping and skip the plastic.",
    metaTitle: "Small Handwoven Gift Basket",
    metaDescription:
      "Small handwoven palm leaf gift basket for presenting soap, seeds or sweets. Reusable afterwards as a desk tidy, with plastic-free packaging as standard.",
    keywords: [
      "small gift basket",
      "woven gift basket",
      "palm leaf basket",
      "mini hamper",
      "natural gift wrap",
    ],
    tags: ["handmade", "gift"],
    material: "Natural palm leaf",
    weight: "90 g",
    dimensions: "16 x 12 x 8 cm",
    colour: "Bright green turning to gold",
    care: "Dust with a soft dry brush and keep it away from damp surfaces.",
    features: [
      "Palm-sized and easy to fill",
      "Low open top shows off the gift",
      "Reusable as a small desk tidy",
      "Flat base so it sits without wobbling",
      "Plastic-free packaging",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>A gift basket has a short life if it is only packaging. This one is designed to be kept. It is small, useful and plain enough to live on a desk or a windowsill once the gift inside has been unwrapped.</p>",
      },
      { type: "heading", level: 3, text: "A quick, tidy weave" },
      {
        type: "paragraph",
        html: "<p>Because the basket is small, the weave can be tight and regular in a way that is hard to manage on a large piece. Each one takes about forty minutes. The rim is folded down and locked with a single tucked strip, so there is no visible knot anywhere.</p>",
      },
      {
        type: "list",
        items: [
          "A bar of soap and a flannel",
          "Seed packets for a gardener",
          "A small jar of honey or jam",
          "Chocolates and a folded note",
        ],
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Size", "16 x 12 cm"],
          ["Depth", "8 cm"],
          ["Rim", "Folded and tucked"],
          ["Making time", "About 40 minutes"],
        ],
      },
      {
        type: "notice",
        tone: "info",
        text: "Add a linen liner or a square of tissue if you are filling it with anything small that might slip between the weave.",
      },
    ],
    images: ["small-gift-basket"],
    reviews: [
      {
        name: "Lucy A.",
        rating: 5,
        date: "2026-02-14",
        text: "I bought six of these for Christmas hampers. They looked lovely on the table and every guest kept theirs to use afterwards.",
      },
      {
        name: "Peter G.",
        rating: 4,
        date: "2025-12-20",
        text: "Sweet little basket, well woven. It is on the small side, so check the measurements, but for soap and sweets it is just right.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 7. Large Laundry Basket
  // ------------------------------------------------------------------
  {
    slug: "large-laundry-basket",
    name: "Large Laundry Basket",
    category: "baskets",
    sku: "LC-BSK-007",
    price: 58.0,
    salePrice: 49.0,
    stock: 11,
    stockStatus: "in_stock",
    badge: "Best Seller",
    rating: 4.8,
    reviewCount: 37,
    featured: true,
    shortDescription:
      "Our biggest basket, woven from wider strips so it stays light even when it is full. Deep sides and a rolled rim that does not bite into your hip on the way to the machine. Built for a full family wash.",
    metaTitle: "Large Woven Laundry Basket",
    metaDescription:
      "Large handwoven palm leaf laundry basket with wide strips and a rolled rim. Light when full, tough enough for daily washing loads, and fully compostable.",
    keywords: [
      "laundry basket",
      "large woven basket",
      "palm leaf laundry basket",
      "natural hamper",
      "big storage basket",
    ],
    tags: ["handmade", "storage", "large"],
    material: "Natural palm leaf",
    weight: "880 g",
    dimensions: "40 x 40 x 46 cm",
    colour: "Deep olive fading to tan",
    care: "Brush out dust and lint with a soft dry brush and reshape the rim by hand if needed.",
    features: [
      "Wide strips keep it light when full",
      "Rolled rim is soft against the hip",
      "Holds a full family wash",
      "Reinforced double base",
      "Plastic-free packaging",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>Large baskets have a problem: the bigger they get, the heavier the weave becomes. We solve it by using wider strips and a more open pattern on this one, so a full basket of laundry still weighs little more than the clothes inside it.</p>",
      },
      { type: "heading", level: 3, text: "The rolled rim" },
      {
        type: "paragraph",
        html: "<p>The top edge is rolled rather than folded flat. It takes longer to finish, but it gives you a rounded edge to rest against your side and it hides the strip ends twice over, which is where a basket of this size would otherwise start to unravel.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Size", "40 x 40 cm"],
          ["Height", "46 cm"],
          ["Base", "Double layer"],
          ["Rim", "Rolled and tucked"],
        ],
      },
      {
        type: "list",
        items: [
          "A full family wash",
          "Bedding and towels",
          "Toys in a playroom",
          "Logs beside a fireplace",
        ],
      },
      {
        type: "notice",
        tone: "warning",
        text: "Always move damp washing straight to the machine. This basket is woven for dry or lightly damp laundry, not for soaking wet loads.",
      },
      {
        type: "quote",
        text: "A laundry basket should be the lightest thing in the room, not the heaviest.",
      },
      {
        type: "paragraph",
        html: "<p>Woven from wider, stronger leaflets, this is the most labour-intensive basket we make. Each one takes a full afternoon and a half.</p>",
      },
    ],
    images: ["large-laundry-basket"],
    reviews: [
      {
        name: "Nadia F.",
        rating: 5,
        date: "2026-04-19",
        text: "Enormous and still easy to carry. It holds our whole family wash and the rolled rim really is comfortable against your hip.",
      },
      {
        name: "Chris V.",
        rating: 5,
        date: "2026-02-05",
        text: "Excellent quality, much nicer than the fabric bin it replaced. It has taken a year of daily use and still looks new.",
      },
      {
        name: "Bea M.",
        rating: 4,
        date: "2025-11-30",
        text: "Big and handsome. It is quite deep, so shorter people may find the bottom a stretch, but it is sturdy and beautifully woven.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 8. Palm Leaf Sun Hat (sold out)
  // ------------------------------------------------------------------
  {
    slug: "palm-leaf-sun-hat",
    name: "Palm Leaf Sun Hat",
    category: "home-decor",
    sku: "LC-HOM-001",
    price: 32.0,
    salePrice: 26.0,
    stock: 0,
    stockStatus: "out_of_stock",
    badge: "Summer",
    rating: 4.7,
    reviewCount: 28,
    featured: true,
    shortDescription:
      "A wide-brim sun hat woven from softened palm leaves in an open pattern that lets the breeze through. The brim shades your face and neck without trapping heat on a long, bright day.",
    metaTitle: "Wide Brim Palm Leaf Sun Hat",
    metaDescription:
      "Wide brim palm leaf sun hat with a breathable open weave and an adjustable inner band. Light, packable and handmade from fresh leaves, plastic-free.",
    keywords: [
      "palm leaf sun hat",
      "woven sun hat",
      "wide brim straw hat",
      "natural summer hat",
      "handmade hat",
    ],
    tags: ["handmade", "summer", "wearable"],
    material: "Natural palm leaf",
    weight: "150 g",
    dimensions: "36 x 36 x 12 cm",
    colour: "Pale green ripening to wheat",
    care: "Let it dry naturally if it gets damp and store it brim-up to keep its shape.",
    features: [
      "Open weave lets air circulate",
      "Wide brim shades face and neck",
      "Adjustable inner band for fit",
      "Folds reasonably flat for packing",
      "Compostable at end of life",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>This hat is woven in a summer tradition that predates sun cream. The pattern is deliberately open, so heat escapes through the crown instead of building up under it, and the brim is broad enough to shade your whole face.</p>",
      },
      { type: "heading", level: 3, text: "Weaving the crown and brim" },
      {
        type: "paragraph",
        html: "<p>Work starts at the crown and spirals outward. At the point where the crown becomes the brim, we change the angle of the weave so the brim flares and then holds its shape. The brim is the slow part: it is wide, and every row has to stay flat.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Brim", "36 cm across"],
          ["Crown", "Adjustable inner band"],
          ["Weave", "Open, breathable"],
          ["Finish", "Untreated natural leaf"],
        ],
      },
      {
        type: "list",
        items: [
          "Gardening on a hot afternoon",
          "Beach and garden days",
          "Harvest markets and festivals",
          "A practical gift for a gardener",
        ],
      },
      {
        type: "notice",
        tone: "warning",
        text: "Sold out for the season. Fresh leaves are at their best in the warmer months, so we weave this hat in small summer batches and reopen orders next spring.",
      },
      {
        type: "quote",
        text: "A good hat does not fight the sun. It simply lets the air do its work.",
      },
    ],
    images: ["palm-leaf-sun-hat"],
    reviews: [
      {
        name: "Rosa E.",
        rating: 5,
        date: "2025-07-15",
        text: "Wore it all through a hot summer and it stayed comfortable. The open weave is far cooler than my fabric hat and it packs flat.",
      },
      {
        name: "Ian T.",
        rating: 4,
        date: "2025-06-28",
        text: "Lovely hat, well shaped brim. It is not fully waterproof, as expected for natural leaf, but for dry sunny days it is perfect.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 9. Woven Planter Cover
  // ------------------------------------------------------------------
  {
    slug: "woven-planter-cover",
    name: "Woven Planter Cover",
    category: "home-decor",
    sku: "LC-HOM-002",
    price: 22.0,
    salePrice: null,
    stock: 30,
    stockStatus: "in_stock",
    badge: "",
    rating: 4.5,
    reviewCount: 14,
    featured: false,
    shortDescription:
      "A tapered basket that slips over a plain plastic nursery pot and hides it completely. The weave is open enough to breathe, so roots do not sit in trapped moisture. Fits a standard 16 cm pot.",
    metaTitle: "Woven Palm Leaf Planter Cover",
    metaDescription:
      "Tapered handwoven palm leaf planter cover that hides a plastic pot and lets roots breathe. Fits pots up to 16 cm, plastic-free and fully compostable.",
    keywords: [
      "planter cover",
      "woven plant pot",
      "palm leaf planter",
      "plant basket",
      "indoor plant decor",
    ],
    tags: ["handmade", "home-decor", "plants"],
    material: "Natural palm leaf",
    weight: "140 g",
    dimensions: "18 x 18 x 17 cm",
    colour: "Soft green fading to oat",
    care: "Empty it and wipe dry if it gets splashed, and never leave a pot standing in water inside it.",
    features: [
      "Fits a standard 16 cm nursery pot",
      "Open weave lets roots breathe",
      "Hides the plastic pot completely",
      "Tapered so the pot sits snugly",
      "Plastic-free packaging",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>Most houseplants live in a plain plastic pot that nobody wants to look at. This cover slides over the top and turns it into something worth keeping on a shelf, without repotting the plant or disturbing its roots.</p>",
      },
      { type: "heading", level: 3, text: "Why it breathes" },
      {
        type: "paragraph",
        html: "<p>We keep the weave slightly open on purpose. A solid ceramic cover traps damp air around the pot, which is one of the most common reasons indoor plants rot at the base. Here, air can move through the walls, so the soil dries at a natural pace.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Fits pot", "Up to 16 cm diameter"],
          ["Height", "17 cm"],
          ["Shape", "Tapered"],
          ["Weave", "Lightly open"],
        ],
      },
      {
        type: "list",
        items: [
          "Pothos and philodendron",
          "Herbs on a kitchen windowsill",
          "A peace lily or spider plant",
          "Small ferns in a bathroom",
        ],
      },
      {
        type: "notice",
        tone: "info",
        text: "Take the plant out to water it, let it drain, then return it. That one habit will keep the cover looking good for years.",
      },
    ],
    images: ["woven-planter-cover"],
    reviews: [
      {
        name: "Maya J.",
        rating: 5,
        date: "2026-03-11",
        text: "Looks so much better than the plastic pot and the plant seems happy. The open sides are a clever touch I did not appreciate until I bought it.",
      },
      {
        name: "Ben O.",
        rating: 4,
        date: "2026-01-07",
        text: "Good looking and well made. My pot was slightly wide so it sat a little high, but it still hides the plastic and looks natural.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 10. Palm Leaf Wall Hanging
  // ------------------------------------------------------------------
  {
    slug: "palm-leaf-wall-hanging",
    name: "Palm Leaf Wall Hanging",
    category: "home-decor",
    sku: "LC-HOM-003",
    price: 46.0,
    salePrice: null,
    stock: 7,
    stockStatus: "in_stock",
    badge: "Limited",
    rating: 4.9,
    reviewCount: 21,
    featured: false,
    shortDescription:
      "A large woven panel of layered leaf shapes, hung from a single cotton loop. Each one is laid out by hand, so no two hangings carry the same pattern of light and shadow. Made in small monthly runs.",
    metaTitle: "Palm Leaf Wall Hanging Art",
    metaDescription:
      "Large handwoven palm leaf wall hanging with layered leaf shapes on a cotton loop. A textured, sculptural panel, made in a limited run and plastic-free.",
    keywords: [
      "palm leaf wall hanging",
      "woven wall art",
      "natural wall decor",
      "leaf wall panel",
      "handmade wall hanging",
    ],
    tags: ["handmade", "home-decor", "wall-art"],
    material: "Palm leaf and cotton cord",
    weight: "480 g",
    dimensions: "48 x 62 x 6 cm",
    colour: "Mixed green, straw and dried brown",
    care: "Dust gently with a soft brush or a hairdryer on a cool setting, and keep it out of direct sun.",
    features: [
      "Layered leaf shapes create texture",
      "Hangs from a single cotton loop",
      "Each panel is laid out by hand",
      "No two hangings are identical",
      "Compostable at end of life",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>This is the piece we make when we want to use the whole leaf, including the darker outer strips and the paler heart. It is not a flat object. It stands a few centimetres off the wall, and the shadows it throws change through the day.</p>",
      },
      { type: "heading", level: 3, text: "Built from leftover strips" },
      {
        type: "paragraph",
        html: "<p>Each panel is assembled from strips left over from basket work, sorted by tone into a loose composition. We build the base row, then layer shapes over it, pinning each one in place before the next goes on. The arrangement is decided as we work, which is why every hanging is different.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Panel", "48 x 62 cm"],
          ["Depth from wall", "About 6 cm"],
          ["Hanging", "Single cotton loop"],
          ["Tones", "Green, straw, dried brown"],
        ],
      },
      {
        type: "list",
        items: [
          "Above a bed or a sofa",
          "A hallway that needs warmth",
          "A dining room with plain walls",
          "A gift for someone who loves texture",
        ],
      },
      {
        type: "notice",
        tone: "info",
        text: "This is a limited piece. We make a small number each month from the season's leftover strips, so the exact tones change from one run to the next.",
      },
      {
        type: "quote",
        text: "Nothing is wasted in a workshop. The scraps of one basket become the pattern of the next.",
      },
      {
        type: "paragraph",
        html: "<p>Hang it away from a radiator or a sunny window. The colours will settle over the first few weeks and then hold for years.</p>",
      },
    ],
    images: ["palm-leaf-wall-hanging"],
    reviews: [
      {
        name: "Clara W.",
        rating: 5,
        date: "2026-04-24",
        text: "It is a real piece of art. The shadows it casts on the wall in the afternoon are almost as lovely as the hanging itself.",
      },
      {
        name: "Noor A.",
        rating: 5,
        date: "2026-02-17",
        text: "Lightweight but substantial, and the mix of tones is beautiful. It completely changed the feel of our hallway.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 11. Set of 4 Woven Coasters
  // ------------------------------------------------------------------
  {
    slug: "woven-coasters-set",
    name: "Set of 4 Woven Coasters",
    category: "home-decor",
    sku: "LC-HOM-004",
    price: 16.0,
    salePrice: 13.0,
    stock: 55,
    stockStatus: "in_stock",
    badge: "Gift Ready",
    rating: 4.6,
    reviewCount: 33,
    featured: false,
    shortDescription:
      "Four round coasters woven tightly enough to stop a ring forming on the table, but thin enough that a mug still sits flat. A small, useful set that comes ready to gift, tied with a cotton string.",
    metaTitle: "Set of 4 Woven Palm Leaf Coasters",
    metaDescription:
      "Set of four round handwoven palm leaf coasters that protect tabletops without wobbling a mug. A tidy, ready-to-gift set with plastic-free packaging.",
    keywords: [
      "woven coasters",
      "palm leaf coasters",
      "set of 4 coasters",
      "natural table coasters",
      "handmade coasters",
    ],
    tags: ["handmade", "table", "gift"],
    material: "Natural palm leaf",
    weight: "120 g",
    dimensions: "10 x 10 x 1 cm",
    colour: "Uniform pale straw",
    care: "Wipe with a dry cloth and stand them on edge to dry if they ever get wet.",
    features: [
      "Set of four matching coasters",
      "Tight weave stops table rings",
      "Thin enough for a mug to sit flat",
      "Tied with a cotton string",
      "Plastic-free packaging",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>Coasters fail in one of two ways: they are too thin to catch condensation, or too thick to let a mug sit level. These are woven to about a centimetre thick, which turns out to be the point where both problems disappear.</p>",
      },
      { type: "heading", level: 3, text: "Woven in matching sets" },
      {
        type: "paragraph",
        html: "<p>Each coaster is a small spiral of tight weave, finished with a tucked edge so there is no ridge underneath. We weave them four at a time from the same leaf so the tone matches across the set, then bind them with a length of cotton string.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Set", "4 coasters"],
          ["Diameter", "10 cm"],
          ["Thickness", "About 1 cm"],
          ["Finish", "Tucked edge, flat underside"],
        ],
      },
      {
        type: "list",
        items: [
          "Coffee and tea mugs",
          "Cold glasses in summer",
          "A small trivet for a warm dish",
          "A housewarming gift",
        ],
      },
      {
        type: "notice",
        tone: "success",
        text: "Sold as a tied set, so it needs no extra wrapping. Just add a name tag and it is ready to give.",
      },
    ],
    images: ["woven-coasters-set"],
    reviews: [
      {
        name: "Emily S.",
        rating: 5,
        date: "2026-03-29",
        text: "Simple, useful and well made. They absorb the condensation from cold glasses and look far nicer than the cork ones we had before.",
      },
      {
        name: "Ahmed R.",
        rating: 5,
        date: "2026-01-12",
        text: "Bought two sets, one to keep and one to gift. The tone matches perfectly across all four and the edges are beautifully finished.",
      },
      {
        name: "Kate L.",
        rating: 4,
        date: "2025-10-02",
        text: "Lovely little coasters. They are slightly rustic in shape, which I like, though a perfectionist might want them more uniform.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 12. Woven Lampshade
  // ------------------------------------------------------------------
  {
    slug: "woven-lampshade",
    name: "Woven Lampshade",
    category: "home-decor",
    sku: "LC-HOM-005",
    price: 44.0,
    salePrice: null,
    stock: 9,
    stockStatus: "in_stock",
    badge: "New",
    rating: 4.8,
    reviewCount: 17,
    featured: true,
    shortDescription:
      "A drum shade woven around a simple steel frame, open enough that light falls through the gaps as a warm pattern of lines. Fits a standard lamp base with a bayonet or screw fitting.",
    metaTitle: "Woven Palm Leaf Drum Lampshade",
    metaDescription:
      "Handwoven palm leaf drum lampshade on a steel frame. Throws a warm, patterned light and fits a standard lamp base, handmade and fully plastic-free.",
    keywords: [
      "woven lampshade",
      "palm leaf lampshade",
      "drum lampshade",
      "natural light shade",
      "handmade lampshade",
    ],
    tags: ["handmade", "home-decor", "lighting"],
    material: "Palm leaf on steel frame",
    weight: "340 g",
    dimensions: "30 x 30 x 22 cm",
    colour: "Warm honey with green undertones",
    care: "Dust with a soft dry brush while the lamp is switched off and cool.",
    features: [
      "Fits a standard lamp base",
      "Open weave casts a patterned light",
      "Steel frame keeps the drum round",
      "Warm, soft glow rather than glare",
      "Plastic-free packaging",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>A lampshade decides the mood of a room more than the bulb does. This one filters light through an open palm weave, so the glow is soft and broken into warm lines instead of a single bright glare.</p>",
      },
      { type: "heading", level: 3, text: "Leaf over steel" },
      {
        type: "paragraph",
        html: "<p>The drum is woven directly onto a powder-coated steel frame, strip by strip, working around the ring until it closes. Because the leaf is woven under tension, the shade holds a true circle and will not warp as the room warms and cools.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Shape", "Drum, 30 cm across"],
          ["Height", "22 cm"],
          ["Fitting", "Standard base, E26/E27"],
          ["Frame", "Powder-coated steel"],
        ],
      },
      {
        type: "list",
        items: [
          "A bedside table lamp",
          "A reading corner",
          "A hallway pendant on a long flex",
          "A dining room that needs warmth",
        ],
      },
      {
        type: "notice",
        tone: "warning",
        text: "Use a low-heat LED bulb. An old-fashioned hot bulb close to the leaf will dry and darken it over time.",
      },
      {
        type: "quote",
        text: "Light through a leaf is never the same twice. That is the whole point of it.",
      },
    ],
    images: ["woven-lampshade"],
    reviews: [
      {
        name: "Julia M.",
        rating: 5,
        date: "2026-05-09",
        text: "The light it throws is gorgeous, warm and gently patterned. It looks far more expensive than it was and fits my base perfectly.",
      },
      {
        name: "Theo B.",
        rating: 5,
        date: "2026-03-05",
        text: "Beautiful craftsmanship. The drum is perfectly round and the weave is even all the way around. Very happy with this purchase.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 13. Natural Placemat Pair
  // ------------------------------------------------------------------
  {
    slug: "natural-placemat-pair",
    name: "Natural Placemat Pair",
    category: "home-decor",
    sku: "LC-HOM-006",
    price: 28.0,
    salePrice: null,
    stock: 24,
    stockStatus: "in_stock",
    badge: "",
    rating: 4.4,
    reviewCount: 13,
    featured: false,
    shortDescription:
      "Two flat, rectangular placemats woven in a fine over-under pattern. They lie dead flat on the table, catch spills and crumbs, and stack away without taking up space. Bound edges resist curling.",
    metaTitle: "Natural Woven Placemat Pair",
    metaDescription:
      "Two flat handwoven palm leaf placemats in a fine over-under weave. Lie flat, protect the table and stack neatly away, with plastic-free packaging.",
    keywords: [
      "woven placemats",
      "palm leaf placemat",
      "natural table mat",
      "dining table placemat",
      "handmade placemat",
    ],
    tags: ["handmade", "table"],
    material: "Natural palm leaf",
    weight: "220 g",
    dimensions: "45 x 32 x 1 cm",
    colour: "Even straw with fine green lines",
    care: "Wipe with a barely damp cloth and stand them on edge to dry after any spill.",
    features: [
      "Set of two matching placemats",
      "Fine weave lies perfectly flat",
      "Wipes clean after spills",
      "Stacks away without bulk",
      "Compostable at end of life",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>A placemat has one job: to sit flat and stay out of the way. We weave these in a fine, dense over-under pattern that has almost no thickness, so plates and glasses never wobble on top of it.</p>",
      },
      { type: "heading", level: 3, text: "A fine, dense weave" },
      {
        type: "paragraph",
        html: "<p>These take longer to make than they look. The strips are cut narrow, around a centimetre, and woven tightly so the surface is nearly smooth. The edges are bound with a folded strip of the same leaf, which keeps the corners from curling after a few washes.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Set", "2 placemats"],
          ["Size", "45 x 32 cm each"],
          ["Weave", "Fine over-under"],
          ["Edge", "Bound, non-curling"],
        ],
      },
      {
        type: "list",
        items: [
          "Everyday family meals",
          "A natural table setting for guests",
          "Under a serving dish as a trivet",
          "A table runner for a small table",
        ],
      },
      {
        type: "notice",
        tone: "info",
        text: "Natural leaf will mark if something hot is set straight on it. Use a board under hot pans and these will last for years.",
      },
    ],
    images: ["natural-placemat-pair"],
    reviews: [
      {
        name: "Laura P.",
        rating: 5,
        date: "2026-02-28",
        text: "Really flat and well woven, exactly what I wanted for the dining table. They clean up easily and look much warmer than cloth.",
      },
      {
        name: "Diego S.",
        rating: 4,
        date: "2025-12-15",
        text: "Good quality and a nice size. The green tint has faded to a lovely straw after a few months, which I think improves them.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 14. Handwoven Leaf Bird
  // ------------------------------------------------------------------
  {
    slug: "handwoven-leaf-bird",
    name: "Handwoven Leaf Bird",
    category: "ornaments",
    sku: "LC-ORN-001",
    price: 12.0,
    salePrice: 9.0,
    stock: 45,
    stockStatus: "in_stock",
    badge: "Small Batch",
    rating: 4.7,
    reviewCount: 26,
    featured: false,
    shortDescription:
      "A little bird folded from a single coconut leaf in the traditional way, with a plump body, a small tail and a loop for hanging. A natural alternative to a plastic gift bow, with no glue and no wire.",
    metaTitle: "Handwoven Coconut Leaf Bird",
    metaDescription:
      "Handwoven leaf bird folded from a single coconut leaf with a hanging loop. A natural gift topper or shelf ornament, plastic-free and compostable.",
    keywords: [
      "woven leaf bird",
      "coconut leaf bird",
      "palm leaf ornament",
      "natural gift topper",
      "handmade bird",
    ],
    tags: ["handmade", "ornament", "gift"],
    material: "Coconut leaf",
    weight: "60 g",
    dimensions: "14 x 6 x 8 cm",
    colour: "Fresh green fading to olive",
    care: "Dust with a soft dry brush and keep it out of direct sunlight to hold the green longer.",
    features: [
      "Folded from a single coconut leaf",
      "Plump body and small tail",
      "Loop for hanging or tying",
      "Natural alternative to a gift bow",
      "Compostable at end of life",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>The bird is one of the oldest shapes in leaf craft, and it is made from one leaf and nothing else. There is no glue and no wire. A few folds and a tucked end turn a flat leaflet into something that reads instantly as a bird.</p>",
      },
      { type: "heading", level: 3, text: "Folded, not assembled" },
      {
        type: "paragraph",
        html: "<p>The body is formed first by rolling the leaflet into a soft oval, then the tail is folded back and tucked through the centre. The whole thing takes about twenty minutes and depends entirely on the leaf being fresh enough to hold a fold.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Material", "One coconut leaflet"],
          ["Length", "14 cm beak to tail"],
          ["Hanging", "Cotton thread loop"],
          ["Making time", "About 20 minutes"],
        ],
      },
      {
        type: "list",
        items: [
          "Tied to a wrapped gift",
          "Hung on a small branch",
          "Perched on a shelf or desk",
          "Scattered along a table for a meal",
        ],
      },
      {
        type: "notice",
        tone: "info",
        text: "Made in small batches through the year, so the green is deepest in summer and warmer in tone in winter.",
      },
    ],
    images: ["handwoven-leaf-bird"],
    reviews: [
      {
        name: "Sophie T.",
        rating: 5,
        date: "2026-03-22",
        text: "Charming little thing, so cleverly folded. I used a dozen as gift toppers and everyone asked where they were from.",
      },
      {
        name: "Mark D.",
        rating: 5,
        date: "2026-01-04",
        text: "Sits on my desk and makes me smile. It is genuinely made from one leaf with no wire, which I find impressive.",
      },
      {
        name: "Ana G.",
        rating: 4,
        date: "2025-09-19",
        text: "Sweet and well folded. It is quite small, so read the measurements, but it looks lovely hanging by a window.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 15. Coconut Leaf Fish Ornament
  // ------------------------------------------------------------------
  {
    slug: "coconut-leaf-fish-ornament",
    name: "Coconut Leaf Fish Ornament",
    category: "ornaments",
    sku: "LC-ORN-002",
    price: 10.0,
    salePrice: null,
    stock: 38,
    stockStatus: "in_stock",
    badge: "",
    rating: 4.3,
    reviewCount: 11,
    featured: false,
    shortDescription:
      "A flat, open fish woven from coconut leaf strips, with a tail that fans into a soft fin. Light enough to hang from a branch or a curtain rail and catch the air. Looks best hung in a small group.",
    metaTitle: "Coconut Leaf Fish Ornament",
    metaDescription:
      "Flat handwoven coconut leaf fish ornament with a fanned tail fin. A light, airy hanging decoration for a branch, window or tree, plastic-free.",
    keywords: [
      "leaf fish ornament",
      "coconut leaf fish",
      "woven fish decoration",
      "natural hanging ornament",
      "palm leaf craft",
    ],
    tags: ["handmade", "ornament"],
    material: "Coconut leaf",
    weight: "40 g",
    dimensions: "18 x 9 x 3 cm",
    colour: "Pale sage with darker spine",
    care: "Dust with a soft dry brush and avoid hanging it where it will get splashed.",
    features: [
      "Flat weave with a fanned tail",
      "Very light, moves in the air",
      "Hangs from a thread loop",
      "Great for a natural tree or branch",
      "Compostable at end of life",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>This fish is woven flat rather than stuffed, which is what gives it its lightness. Hung near a window or an open door, it turns gently in the draught and the open weave lets light through the body.</p>",
      },
      { type: "heading", level: 3, text: "Woven flat and open" },
      {
        type: "paragraph",
        html: "<p>The body is a simple over-under panel, shaped by adding and dropping strips at the head and tail. The tail is left uncut so its natural fronds fan out into a fin. Because the piece is flat, it is quick to make and easy to store between seasons.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Length", "18 cm"],
          ["Width", "9 cm at the body"],
          ["Tail", "Fanned natural fronds"],
          ["Hanging", "Thread loop at the head"],
        ],
      },
      {
        type: "list",
        items: [
          "A coastal-themed tree or garland",
          "A child's bedroom window",
          "Tied onto a wrapped gift",
          "A row of several along a string",
        ],
      },
      {
        type: "notice",
        tone: "info",
        text: "These look best in groups. Three or four strung along a length of cotton make an instant garland.",
      },
    ],
    images: ["coconut-leaf-fish-ornament"],
    reviews: [
      {
        name: "Hazel F.",
        rating: 4,
        date: "2026-02-19",
        text: "Light and pretty, and it moves in the breeze from the window. Simple but very effective hung in a little row of three.",
      },
      {
        name: "Ravi K.",
        rating: 5,
        date: "2025-11-21",
        text: "Nice flat weave and a lovely natural colour. I used several for a beach-themed display and they were exactly right.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 16. Leaf Star Ornament (sold out)
  // ------------------------------------------------------------------
  {
    slug: "leaf-star-ornament",
    name: "Leaf Star Ornament",
    category: "ornaments",
    sku: "LC-ORN-003",
    price: 8.0,
    salePrice: null,
    stock: 0,
    stockStatus: "out_of_stock",
    badge: "Seasonal",
    rating: 4.5,
    reviewCount: 22,
    featured: false,
    shortDescription:
      "A small five-pointed star folded from narrow leaf strips, hollow in the middle so light shows through. We weave these for the winter season and they sell out every year. A thread loop is tied on for hanging.",
    metaTitle: "Folded Leaf Star Ornament",
    metaDescription:
      "Small five-pointed folded leaf star ornament, hollow in the middle so light shows through. A seasonal handmade decoration, plastic-free and compostable.",
    keywords: [
      "leaf star ornament",
      "folded star decoration",
      "natural christmas ornament",
      "palm leaf star",
      "handmade star",
    ],
    tags: ["handmade", "ornament", "seasonal"],
    material: "Palm leaf",
    weight: "30 g",
    dimensions: "9 x 9 x 3 cm",
    colour: "Dry gold with green tips",
    care: "Store flat in a dry box between seasons and dust with a soft brush.",
    features: [
      "Five-pointed star, folded not cut",
      "Hollow centre lets light through",
      "Light enough for a thin branch",
      "Thread loop for hanging",
      "Compostable at end of life",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>There is something satisfying about a star that folds rather than cuts. Each point is created by folding a strip back on itself, so the shape has no sharp edges and the centre stays open, letting a fairy light or a candle glow shine straight through.</p>",
      },
      { type: "heading", level: 3, text: "Five points, one rhythm" },
      {
        type: "paragraph",
        html: "<p>The first point sets the size of all the others. We fold the leaf into a small loop, then repeat the same fold four more times, tucking the final strip under the first to close the circle. Get the first two even and the rest fall into place.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Points", "Five, folded"],
          ["Width", "9 cm across"],
          ["Centre", "Open"],
          ["Hanging", "Thread loop"],
        ],
      },
      {
        type: "list",
        items: [
          "A natural Christmas tree",
          "Strung into a garland",
          "Tied to a gift or a wreath",
          "Hung in a window in winter",
        ],
      },
      {
        type: "notice",
        tone: "warning",
        text: "Out of stock until the next season. We fold these in autumn from the year's drier leaves, and the last run sold out before December.",
      },
      {
        type: "quote",
        text: "A star is a fold, a loop and a bit of patience. Nothing more.",
      },
    ],
    images: ["leaf-star-ornament"],
    reviews: [
      {
        name: "Ingrid H.",
        rating: 5,
        date: "2025-12-08",
        text: "These are beautiful on the tree and the open centres catch the lights perfectly. I came back to buy more but they had sold out.",
      },
      {
        name: "Paul R.",
        rating: 4,
        date: "2025-11-29",
        text: "Well folded and very neat. They are light enough for a real tree and looked lovely strung into a garland across the mantel.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 17. Woven Leaf Flower
  // ------------------------------------------------------------------
  {
    slug: "woven-leaf-flower",
    name: "Woven Leaf Flower",
    category: "ornaments",
    sku: "LC-ORN-004",
    price: 9.0,
    salePrice: null,
    stock: 42,
    stockStatus: "in_stock",
    badge: "",
    rating: 4.6,
    reviewCount: 15,
    featured: false,
    shortDescription:
      "A layered leaf flower with five soft petals and a tucked centre, woven to sit flat on a table or to be pinned to a wrapped parcel. A quiet, natural finishing touch made from pale inner leaflets.",
    metaTitle: "Woven Palm Leaf Flower Ornament",
    metaDescription:
      "Layered handwoven palm leaf flower with five soft petals and a tucked centre. Sits flat on a table or decorates a gift, handmade and plastic-free.",
    keywords: [
      "woven leaf flower",
      "palm leaf flower",
      "natural flower ornament",
      "table decoration",
      "handmade leaf craft",
    ],
    tags: ["handmade", "ornament", "table"],
    material: "Palm leaf",
    weight: "35 g",
    dimensions: "11 x 11 x 2 cm",
    colour: "Soft green with a cream centre",
    care: "Keep flat and dry, and dust with a soft brush between uses.",
    features: [
      "Five layered petals",
      "Tucked centre with no visible knot",
      "Sits flat on any table",
      "Thread loop for hanging",
      "Compostable at end of life",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>Leaf flowers are usually flat discs with a pattern printed on them. This one is built in layers instead: five broad petals, then a smaller inner ring, then a tight centre tucked in last. It reads as a flower from across the room.</p>",
      },
      { type: "heading", level: 3, text: "Built in three layers" },
      {
        type: "paragraph",
        html: "<p>We start with the outer petals, woven as one piece, then add a second smaller ring on top so the petals overlap. The centre is a single coiled strip pressed into the middle and locked from behind. Each flower takes around thirty-five minutes.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Petals", "Five, in two layers"],
          ["Diameter", "11 cm"],
          ["Thickness", "About 2 cm"],
          ["Finish", "Tucked centre, flat back"],
        ],
      },
      {
        type: "list",
        items: [
          "Scattered along a dining table",
          "Tied to a wrapped gift",
          "Pinned above a doorway",
          "A small gift on its own",
        ],
      },
      {
        type: "notice",
        tone: "info",
        text: "Made from pale inner leaflets, so the tone is softer than our baskets. It pairs well with the darker coconut leaf pieces.",
      },
    ],
    images: ["woven-leaf-flower"],
    reviews: [
      {
        name: "Tessa L.",
        rating: 5,
        date: "2026-04-01",
        text: "So pretty and much more detailed than I expected. I used a handful down the middle of a long table for a birthday lunch.",
      },
      {
        name: "Gwen M.",
        rating: 4,
        date: "2026-02-08",
        text: "Lovely layered shape and a nice soft colour. They are delicate, so handle with care, but the finish is very neat.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 18. Set of 3 Hanging Birds
  // ------------------------------------------------------------------
  {
    slug: "hanging-birds-trio",
    name: "Set of 3 Hanging Birds",
    category: "ornaments",
    sku: "LC-ORN-005",
    price: 28.0,
    salePrice: 22.0,
    stock: 20,
    stockStatus: "in_stock",
    badge: "Gift Ready",
    rating: 4.8,
    reviewCount: 29,
    featured: false,
    shortDescription:
      "Three woven birds on graded lengths of cotton cord, so they hang at different heights and gently turn together. A mobile for a quiet corner, ready to gift as a set and balanced by hand to hang level.",
    metaTitle: "Set of 3 Hanging Leaf Birds",
    metaDescription:
      "Set of three woven leaf birds on graded cotton cords, hanging at different heights. A gentle natural mobile, ready to gift with plastic-free packaging.",
    keywords: [
      "hanging birds set",
      "woven bird mobile",
      "leaf bird trio",
      "natural hanging decoration",
      "handmade birds",
    ],
    tags: ["handmade", "ornament", "gift"],
    material: "Coconut leaf and cotton cord",
    weight: "150 g",
    dimensions: "18 x 10 x 40 cm",
    colour: "Green, olive and dried brown",
    care: "Dust with a soft brush and untangle the cords gently if they cross.",
    features: [
      "Three birds on graded cords",
      "Hangs at different heights",
      "Turns gently in moving air",
      "Ready to gift as a set",
      "Compostable at end of life",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>One bird is a small ornament. Three birds on graded cords become a mobile, and a mobile is a different thing entirely: it moves, it casts shifting shadows, and it draws the eye whenever the air in the room stirs.</p>",
      },
      { type: "heading", level: 3, text: "Balanced to hang true" },
      {
        type: "paragraph",
        html: "<p>The three birds are folded in the same way as our single ones, then tied to cords of different lengths and gathered onto a small wooden ring. We balance each set by hand so it hangs level and rotates slowly rather than spinning.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Birds", "Three, graded cords"],
          ["Longest cord", "40 cm"],
          ["Hanger", "Small wooden ring"],
          ["Balance", "Set by hand"],
        ],
      },
      {
        type: "list",
        items: [
          "A nursery or child's room",
          "A sunny window corner",
          "Above a reading chair",
          "A new baby gift",
        ],
      },
      {
        type: "notice",
        tone: "success",
        text: "Comes tied and balanced, so it can go straight onto a hook. We will include a gift card at no charge if you are sending it on.",
      },
      {
        type: "quote",
        text: "Give a room one thing that moves, and it stops feeling still.",
      },
    ],
    images: ["hanging-birds-trio"],
    reviews: [
      {
        name: "Naomi W.",
        rating: 5,
        date: "2026-03-14",
        text: "Hung it in the nursery and it turns so gently. Beautifully balanced and the three tones of leaf look wonderful together.",
      },
      {
        name: "Carl B.",
        rating: 5,
        date: "2026-01-26",
        text: "Bought as a new baby gift and it was very well received. It arrived tied and ready to hang, no assembly needed at all.",
      },
      {
        name: "Yuki S.",
        rating: 5,
        date: "2025-12-11",
        text: "A lovely, calm piece. The birds are neatly folded and the cords are even. It looks handmade in the best possible way.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 19. Woven Gift Box with Lid
  // ------------------------------------------------------------------
  {
    slug: "woven-gift-box-with-lid",
    name: "Woven Gift Box with Lid",
    category: "gifts",
    sku: "LC-GIF-001",
    price: 18.0,
    salePrice: null,
    stock: 33,
    stockStatus: "in_stock",
    badge: "Gift Ready",
    rating: 4.7,
    reviewCount: 24,
    featured: true,
    shortDescription:
      "A square woven box with a fitted lid that sits flush on the rim. The packaging becomes part of the present, and the box stays useful long after the gift inside is opened, ready to reuse for years.",
    metaTitle: "Woven Palm Leaf Gift Box with Lid",
    metaDescription:
      "Square handwoven palm leaf gift box with a fitted lid that sits flush. Reusable as storage after the gift is opened, handmade and completely plastic-free.",
    keywords: [
      "woven gift box",
      "palm leaf box with lid",
      "natural gift packaging",
      "handmade storage box",
      "eco gift box",
    ],
    tags: ["handmade", "gift", "storage"],
    material: "Natural palm leaf",
    weight: "200 g",
    dimensions: "16 x 16 x 12 cm",
    colour: "Even straw with green flecks",
    care: "Dust with a soft dry brush and store the lid on to keep the box square.",
    features: [
      "Fitted lid sits flush on the rim",
      "Sturdy enough for small keepsakes",
      "Reusable long after the gift",
      "Holds its square shape",
      "Plastic-free packaging",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>A gift box that is thrown away is a waste of good material. This one is woven to be kept. The lid fits closely enough to stay on when carried, and the box is strong enough to hold jewellery, letters or small treasures on a shelf afterwards.</p>",
      },
      { type: "heading", level: 3, text: "Making the lid fit" },
      {
        type: "paragraph",
        html: "<p>The base and lid are woven as two separate squares, then matched by hand. We check the fit while both are still slightly damp, because the leaf shrinks a little as it dries. Get it right at that stage and the lid stays snug for years.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Size", "16 x 16 x 12 cm"],
          ["Lid", "Fitted, woven separately"],
          ["Weave", "Tight square over-under"],
          ["Finish", "Folded rim on both parts"],
        ],
      },
      {
        type: "list",
        items: [
          "Jewellery and small keepsakes",
          "A gift of chocolates or tea",
          "Photos and letters",
          "A set of our coasters as a gift",
        ],
      },
      {
        type: "notice",
        tone: "info",
        text: "Fill it with tissue or a linen square if the gift is small, so it does not rattle when the lid is on.",
      },
    ],
    images: ["woven-gift-box-with-lid"],
    reviews: [
      {
        name: "Freya N.",
        rating: 5,
        date: "2026-04-11",
        text: "The lid fits beautifully and the box is genuinely reusable. I have kept mine on a shelf holding letters since Christmas.",
      },
      {
        name: "Owen T.",
        rating: 5,
        date: "2026-02-01",
        text: "Well made and a lovely alternative to wrapping paper. The weave is tight and even and it feels sturdy in the hand.",
      },
      {
        name: "Mira P.",
        rating: 4,
        date: "2025-12-23",
        text: "Very nice box, neatly finished. The lid is a snug fit, which is good, though you need two hands to open it. Looks great.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 20. Miniature Leaf Basket
  // ------------------------------------------------------------------
  {
    slug: "miniature-leaf-basket",
    name: "Miniature Leaf Basket",
    category: "gifts",
    sku: "LC-GIF-002",
    price: 7.0,
    salePrice: null,
    stock: 60,
    stockStatus: "in_stock",
    badge: "",
    rating: 4.4,
    reviewCount: 9,
    featured: false,
    shortDescription:
      "A thumb-sized basket woven with the same technique as the full-size ones, down to the folded rim. A tiny, cheerful object for a table setting, a shelf or a party favour that holds a few sweets or a ring.",
    metaTitle: "Miniature Woven Palm Leaf Basket",
    metaDescription:
      "Thumb-sized handwoven palm leaf miniature basket with a folded rim. A charming party favour, table detail or small gift, plastic-free and compostable.",
    keywords: [
      "miniature basket",
      "small woven basket",
      "party favour basket",
      "palm leaf miniature",
      "tiny basket",
    ],
    tags: ["handmade", "gift", "small"],
    material: "Natural palm leaf",
    weight: "25 g",
    dimensions: "6 x 6 x 5 cm",
    colour: "Bright green fading to straw",
    care: "Keep dry and dust with a soft dry brush.",
    features: [
      "Thumb-sized but fully woven",
      "Folded rim like the full-size basket",
      "Great as a table favour",
      "Holds a few sweets or a ring",
      "Compostable at end of life",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>Weaving small is harder than weaving large. The strips have to be cut narrow, the tension has to stay even over short distances, and there is no room to hide a loose end. This little basket is made exactly like its full-size cousin, just at a fraction of the scale.</p>",
      },
      { type: "heading", level: 3, text: "Small work, same method" },
      {
        type: "paragraph",
        html: "<p>The technique does not change: a flat base, straight sides, a folded rim. What changes is that everything happens in the fingertips rather than the whole hand, and a single leaflet yields several baskets instead of one.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Size", "6 x 6 cm"],
          ["Height", "5 cm"],
          ["Method", "Same as full-size baskets"],
          ["Making time", "About 25 minutes"],
        ],
      },
      {
        type: "list",
        items: [
          "A table favour at a wedding or party",
          "Holding a ring or a pair of earrings",
          "A few wrapped sweets",
          "A row along a windowsill",
        ],
      },
      {
        type: "notice",
        tone: "info",
        text: "Ordering for an event? These are made to order in larger numbers, so allow a little extra time for a big set.",
      },
    ],
    images: ["miniature-leaf-basket"],
    reviews: [
      {
        name: "Poppy H.",
        rating: 5,
        date: "2026-03-09",
        text: "Adorable and beautifully woven for the size. I used them as favours at a small party and guests loved them.",
      },
      {
        name: "Leo M.",
        rating: 4,
        date: "2025-10-30",
        text: "Tiny but perfectly formed, with a proper folded rim. It is small enough to lose, so keep it somewhere safe.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 21. Woven Keepsake Box
  // ------------------------------------------------------------------
  {
    slug: "woven-keepsake-box",
    name: "Woven Keepsake Box",
    category: "gifts",
    sku: "LC-GIF-003",
    price: 24.0,
    salePrice: null,
    stock: 19,
    stockStatus: "in_stock",
    badge: "Workshop Favourite",
    rating: 4.8,
    reviewCount: 18,
    featured: false,
    shortDescription:
      "A rectangular box with a deep body and a lid that overlaps the sides, woven tightly enough to keep out dust. Built for the things you keep but do not display, and shallow enough to fit neatly on a shelf.",
    metaTitle: "Woven Palm Leaf Keepsake Box",
    metaDescription:
      "Deep rectangular handwoven palm leaf keepsake box with an overlapping lid. Keeps dust off letters and small treasures, handmade and plastic-free.",
    keywords: [
      "keepsake box",
      "woven memory box",
      "palm leaf storage box",
      "natural box with lid",
      "handmade keepsake",
    ],
    tags: ["handmade", "storage", "gift"],
    material: "Natural palm leaf",
    weight: "320 g",
    dimensions: "22 x 15 x 10 cm",
    colour: "Warm straw with a darker lid",
    care: "Dust with a soft dry brush and keep it out of damp rooms.",
    features: [
      "Lid overlaps the sides to keep dust out",
      "Deep body for letters and photos",
      "Rectangular so it fits a shelf",
      "Tight weave, smooth to the touch",
      "Compostable at end of life",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>Some things are worth keeping but not worth showing: letters, tickets, a first drawing. This box is made for exactly those, with a lid that drops over the sides rather than sitting inside them, so dust stays out and the box can be stacked.</p>",
      },
      { type: "heading", level: 3, text: "A lid that overlaps" },
      {
        type: "paragraph",
        html: "<p>An inset lid is easier to weave but lets dust settle into the gap. This lid is woven slightly larger than the body so it covers the top edge completely. We add a small woven tab at the front so it lifts easily without a handle.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Size", "22 x 15 x 10 cm"],
          ["Lid", "Overlapping, with lift tab"],
          ["Weave", "Dense and smooth"],
          ["Body", "Deep, single piece"],
        ],
      },
      {
        type: "list",
        items: [
          "Letters and postcards",
          "Photographs and negatives",
          "Small tools or sewing supplies",
          "A child's first drawings",
        ],
      },
      {
        type: "notice",
        tone: "info",
        text: "Line it with a square of tissue if you are storing anything delicate, since the natural leaf has a slightly rough inside face.",
      },
    ],
    images: ["woven-keepsake-box"],
    reviews: [
      {
        name: "Sara K.",
        rating: 5,
        date: "2026-04-03",
        text: "A really well-made box. The lid overlaps properly so nothing gets dusty, and it looks lovely on a shelf beside my books.",
      },
      {
        name: "James L.",
        rating: 5,
        date: "2026-02-12",
        text: "Bought it for my letters and it is perfect. Deep, sturdy and the weave is very even. Much nicer than a plastic storage box.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 22. Natural Gift Topper Set
  // ------------------------------------------------------------------
  {
    slug: "natural-gift-topper-set",
    name: "Natural Gift Topper Set",
    category: "gifts",
    sku: "LC-GIF-004",
    price: 15.0,
    salePrice: 12.0,
    stock: 50,
    stockStatus: "in_stock",
    badge: "",
    rating: 4.5,
    reviewCount: 12,
    featured: false,
    shortDescription:
      "A set of small woven toppers, a bird, a flower and a star, each with a thread loop for tying onto a parcel. A reusable answer to the plastic bow. Keep them in a drawer and reuse them year after year.",
    metaTitle: "Natural Gift Topper Set of 3",
    metaDescription:
      "Set of three small woven leaf gift toppers with thread loops, a bird, a flower and a star. A reusable, plastic-free alternative to ribbon bows.",
    keywords: [
      "gift topper set",
      "natural gift decoration",
      "woven gift topper",
      "reusable gift bow",
      "palm leaf decoration",
    ],
    tags: ["handmade", "gift", "set"],
    material: "Palm leaf and coconut leaf",
    weight: "70 g",
    dimensions: "10 x 10 x 8 cm",
    colour: "Mixed green and dry gold",
    care: "Keep dry and store in the box between uses so they do not crush.",
    features: [
      "Three different woven toppers",
      "Each has a thread loop for tying",
      "Reusable year after year",
      "Replaces a plastic bow",
      "Compostable at end of life",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>A bow is used once and thrown away. These toppers are tied on, admired, and then kept for the next parcel. The set mixes a folded bird, a layered flower and a folded star, so you have a choice of shapes for different gifts.</p>",
      },
      { type: "heading", level: 3, text: "What is in the set" },
      {
        type: "paragraph",
        html: "<p>Each topper is made with the same care as our larger ornaments but in a compact size, with a cotton thread loop at the top. Tie one over a simple paper wrap and it does the work of ribbon without the waste.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Set", "Bird, flower and star"],
          ["Size", "Around 8 to 10 cm each"],
          ["Fixing", "Cotton thread loop"],
          ["Reuse", "Kept and re-tied"],
        ],
      },
      {
        type: "list",
        items: [
          "Tying up parcels and hampers",
          "Decorating a gift table",
          "Adding to a bottle of wine",
          "A small gift in itself",
        ],
      },
      {
        type: "notice",
        tone: "success",
        text: "A good set to keep in a drawer. Buy it once and you will reach for it every birthday and holiday.",
      },
    ],
    images: ["natural-gift-topper-set"],
    reviews: [
      {
        name: "Dana R.",
        rating: 5,
        date: "2026-03-30",
        text: "I have stopped buying ribbon entirely. These tie onto a plain paper wrap and look far nicer, and I reuse them every time.",
      },
      {
        name: "Neil F.",
        rating: 4,
        date: "2025-12-18",
        text: "Nice little set and good value. The star is my favourite. They are small, so best for smaller parcels rather than big boxes.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 23. Mini Woven Pouch
  // ------------------------------------------------------------------
  {
    slug: "mini-woven-pouch",
    name: "Mini Woven Pouch",
    category: "gifts",
    sku: "LC-GIF-005",
    price: 13.0,
    salePrice: null,
    stock: 36,
    stockStatus: "in_stock",
    badge: "",
    rating: 4.3,
    reviewCount: 8,
    featured: false,
    shortDescription:
      "A small woven pouch with a drawstring cord, sized for earbuds, keys or a pair of earrings. Soft enough to slip into a pocket and sturdy enough to keep its shape, with the cord threaded straight through the weave.",
    metaTitle: "Mini Woven Palm Leaf Pouch",
    metaDescription:
      "Small handwoven palm leaf pouch with a drawstring cord for earbuds, keys or jewellery. Soft, sturdy and pocket-sized, handmade with no plastic.",
    keywords: [
      "woven pouch",
      "small drawstring bag",
      "palm leaf pouch",
      "natural gift bag",
      "mini woven bag",
    ],
    tags: ["handmade", "gift", "small"],
    material: "Palm leaf and cotton cord",
    weight: "60 g",
    dimensions: "9 x 7 x 4 cm",
    colour: "Pale green with a cream cord",
    care: "Dust with a soft brush and loosen the drawstring before storing it flat.",
    features: [
      "Drawstring cotton cord closure",
      "Sized for earbuds or jewellery",
      "Slips into a pocket or bag",
      "Holds its shape when empty",
      "Plastic-free packaging",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>This pouch is the smallest thing we weave that still closes. It is a little rounded bag with a drawstring threaded through the top row, made for the small loose things that otherwise roll around the bottom of a bag.</p>",
      },
      { type: "heading", level: 3, text: "A drawstring through the weave" },
      {
        type: "paragraph",
        html: "<p>Rather than sewing a channel, we leave the top row slightly open as we weave, then thread a cotton cord straight through the gaps. Pull the cord and the pouch closes in a soft pleat. It is a simple trick and it means the closure can never come apart from the bag.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Size", "9 x 7 cm"],
          ["Depth", "4 cm"],
          ["Closure", "Threaded cotton drawstring"],
          ["Weave", "Tight, rounded body"],
        ],
      },
      {
        type: "list",
        items: [
          "Wireless earbuds and a cable",
          "Keys and a few coins",
          "Earrings and a ring",
          "A small gift presented in the pouch",
        ],
      },
      {
        type: "notice",
        tone: "info",
        text: "A natural way to present a small piece of jewellery. Pull the cord tight and the whole gift is wrapped.",
      },
    ],
    images: ["mini-woven-pouch"],
    reviews: [
      {
        name: "Ivy C.",
        rating: 5,
        date: "2026-02-24",
        text: "Perfect little pouch for my earbuds. The drawstring works smoothly and it has kept its shape in my bag for months.",
      },
      {
        name: "Rob A.",
        rating: 4,
        date: "2025-11-16",
        text: "Neat and useful. It is quite small so check the size, but for a ring or some coins it is exactly right and very nicely woven.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 24. Beginner Weaving Kit for Kids
  // ------------------------------------------------------------------
  {
    slug: "beginner-weaving-kit-for-kids",
    name: "Beginner Weaving Kit for Kids",
    category: "kids-crafts",
    sku: "LC-KID-001",
    price: 27.0,
    salePrice: null,
    stock: 25,
    stockStatus: "in_stock",
    badge: "Beginner",
    rating: 4.9,
    reviewCount: 41,
    featured: true,
    shortDescription:
      "Everything a child needs to weave their first basket: pre-cut softened leaf strips, a simple wooden tool and an illustrated guide that walks through every fold with pictures, not jargon.",
    metaTitle: "Beginner Weaving Kit for Kids",
    metaDescription:
      "Beginner palm leaf weaving kit for kids with pre-cut strips, a wooden tool and an illustrated guide. Enough material for one small basket, age 7 and up.",
    keywords: [
      "weaving kit for kids",
      "beginner weaving kit",
      "palm leaf craft kit",
      "kids craft activity",
      "learn to weave",
    ],
    tags: ["handmade", "kids", "kit"],
    material: "Palm leaf, wood and cotton",
    weight: "300 g",
    dimensions: "24 x 18 x 6 cm",
    colour: "Mixed green strips and pale wood",
    care: "Keep the strips in the sealed bag until use and store the tool dry.",
    features: [
      "Pre-cut and softened leaf strips",
      "Simple wooden weaving tool",
      "Illustrated step-by-step guide",
      "Enough material for one basket",
      "Recommended age 7 and up",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>Children take to leaf weaving faster than adults do, mostly because they are not worried about making a mistake. This kit removes the two things that slow a beginner down: cutting strips evenly and keeping the leaf soft enough to bend.</p>",
      },
      { type: "heading", level: 3, text: "What is in the box" },
      {
        type: "paragraph",
        html: "<p>Every kit contains a bundle of pre-cut strips, softened and ready to use, a smooth wooden tool for tightening the weave, and a printed guide that shows each fold in a clear drawing with a short sentence beside it. No reading ahead is needed. One picture, one step.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Contents", "Strips, tool and guide"],
          ["Makes", "One small basket"],
          ["Age", "7 and up"],
          ["Adult help", "Recommended for ages 7 to 9"],
        ],
      },
      {
        type: "list",
        items: [
          "A rainy afternoon activity",
          "A birthday party craft table",
          "Home education projects",
          "A screen-free weekend",
        ],
      },
      {
        type: "notice",
        tone: "info",
        text: "Use the strips within about a week of opening the bag. They stay soft in the sealed packaging but dry out once exposed to air.",
      },
      {
        type: "quote",
        text: "Children do not need a simpler craft. They need a clearer one.",
      },
      {
        type: "paragraph",
        html: "<p>Finished baskets are usually lopsided and always charming. That is the right result for a first attempt.</p>",
      },
    ],
    images: ["beginner-weaving-kit-for-kids"],
    reviews: [
      {
        name: "Rachel M.",
        rating: 5,
        date: "2026-04-15",
        text: "My seven year old finished the basket in one afternoon with barely any help. The illustrated guide is genuinely clear and well done.",
      },
      {
        name: "Steve H.",
        rating: 5,
        date: "2026-03-02",
        text: "Great kit. The pre-cut strips make all the difference, no frustration, no scissors needed. We have bought a second one already.",
      },
      {
        name: "Amara O.",
        rating: 5,
        date: "2026-01-21",
        text: "Used it with a group of nine year olds at a party and every single one made a basket. The tool is a lovely touch.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 25. Palm Leaf Sun Hat Kit
  // ------------------------------------------------------------------
  {
    slug: "palm-leaf-sun-hat-kit",
    name: "Palm Leaf Sun Hat Kit",
    category: "kids-crafts",
    sku: "LC-KID-002",
    price: 21.0,
    salePrice: 17.0,
    stock: 28,
    stockStatus: "in_stock",
    badge: "Beginner",
    rating: 4.6,
    reviewCount: 20,
    featured: false,
    shortDescription:
      "A kit for weaving a real sun hat at home, with wider pre-softened strips that are easier to hold and a printed guide for the crown and brim. Recommended for ages ten and up, with enough material for one hat.",
    metaTitle: "Palm Leaf Sun Hat Weaving Kit",
    metaDescription:
      "Weave a real palm leaf sun hat at home with wider pre-softened strips and a printed guide for crown and brim. A hands-on kit for ages ten and up.",
    keywords: [
      "sun hat kit",
      "palm leaf hat kit",
      "weaving kit for kids",
      "diy sun hat",
      "learn to weave a hat",
    ],
    tags: ["handmade", "kids", "kit"],
    material: "Palm leaf and printed guide",
    weight: "280 g",
    dimensions: "26 x 20 x 6 cm",
    colour: "Green strips with a straw band",
    care: "Keep the strips sealed until use and let the finished hat dry brim-up.",
    features: [
      "Wider strips, easier to hold",
      "Printed guide for crown and brim",
      "Enough material for one hat",
      "Fits most ages ten and up",
      "Plastic-free packaging",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>A hat is a bigger project than a small basket, so this kit is pitched at older children and adults who want a proper challenge. The strips are cut wider than usual, which makes them easier to grip and keeps the weave from slipping while you learn.</p>",
      },
      { type: "heading", level: 3, text: "From crown to brim" },
      {
        type: "paragraph",
        html: "<p>The guide is split into two parts. The first covers the crown, a simple spiral that is forgiving of small errors. The second covers the brim, where the weave opens out and the shape has to stay flat. Take your time on the crown and the brim is much easier.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Makes", "One sun hat"],
          ["Guide", "Two parts, crown and brim"],
          ["Age", "10 and up"],
          ["Strips", "Wider cut, pre-softened"],
        ],
      },
      {
        type: "list",
        items: [
          "A summer holiday project",
          "A rainy weekend indoors",
          "A craft club session",
          "A gift for a curious teenager",
        ],
      },
      {
        type: "notice",
        tone: "warning",
        text: "Allow about three hours for a first hat. It is not a project to rush, and the strips want to be used while they are still pliable.",
      },
      {
        type: "paragraph",
        html: "<p>The finished hat is wearable and genuinely useful. Expect your first one to fit a little loosely, then adjust the next.</p>",
      },
    ],
    images: ["palm-leaf-sun-hat-kit"],
    reviews: [
      {
        name: "Helen B.",
        rating: 5,
        date: "2026-03-26",
        text: "My daughter and I made one each over a weekend. The wider strips are much easier to work with and the guide was clear throughout.",
      },
      {
        name: "Nate D.",
        rating: 4,
        date: "2026-02-09",
        text: "Good kit with plenty of material. It took us nearly three hours as warned. The brim is fiddly but the instructions were honest about that.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 26. Kids Leaf Craft Bundle
  // ------------------------------------------------------------------
  {
    slug: "kids-leaf-craft-bundle",
    name: "Kids Leaf Craft Bundle",
    category: "kids-crafts",
    sku: "LC-KID-003",
    price: 34.0,
    salePrice: null,
    stock: 16,
    stockStatus: "in_stock",
    badge: "Family Set",
    rating: 4.7,
    reviewCount: 27,
    featured: false,
    shortDescription:
      "Three projects in one box: a small basket, a folded bird and a leaf flower, with enough strips for siblings to work side by side. A whole afternoon of making, not just one craft, graded from easiest to hardest.",
    metaTitle: "Kids Leaf Craft Bundle of 3 Projects",
    metaDescription:
      "Kids leaf craft bundle with three palm leaf projects, a basket, a bird and a flower. Enough pre-cut strips for two children to make together.",
    keywords: [
      "kids craft bundle",
      "leaf craft set",
      "family craft activity",
      "palm leaf projects",
      "childrens craft kit",
    ],
    tags: ["handmade", "kids", "kit"],
    material: "Palm leaf, wood and cotton",
    weight: "520 g",
    dimensions: "28 x 22 x 8 cm",
    colour: "Mixed green and gold strips",
    care: "Store the strips sealed until use and keep the guide dry.",
    features: [
      "Three projects in one box",
      "Enough strips for two children",
      "Illustrated guide for each project",
      "Graded from easiest to hardest",
      "Recommended age 7 and up",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>One craft project is an activity. Three is an afternoon. This bundle is built for siblings or a small group, with enough material to keep two children busy and a mix of projects that gets gradually harder as confidence grows.</p>",
      },
      { type: "heading", level: 3, text: "Three projects, one box" },
      {
        type: "paragraph",
        html: "<p>The bird is quickest, a warm-up that takes about twenty minutes. The flower comes next, with more careful layering. The basket is the main event and takes around an hour. Each has its own illustrated guide, so nobody has to wait their turn.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Projects", "Bird, flower and basket"],
          ["Serves", "Two children"],
          ["Order", "Easiest to hardest"],
          ["Age", "7 and up"],
        ],
      },
      {
        type: "list",
        items: [
          "A rainy weekend with two kids",
          "A holiday craft box",
          "A small birthday party",
          "Home education nature study",
        ],
      },
      {
        type: "notice",
        tone: "success",
        text: "Our most popular gift for families. Everything is pre-cut and softened, so there is no knife or scissors work for young children.",
      },
      {
        type: "quote",
        text: "Give two children one box of leaves and you will not hear from them for an hour.",
      },
    ],
    images: ["kids-leaf-craft-bundle"],
    reviews: [
      {
        name: "Fiona G.",
        rating: 5,
        date: "2026-04-08",
        text: "Kept both my children busy for a whole rainy afternoon with no squabbling over materials. Excellent value for three projects.",
      },
      {
        name: "Marcus Y.",
        rating: 5,
        date: "2026-02-16",
        text: "Really well put together. The bird is a great warm-up and by the time they got to the basket they were confident weavers.",
      },
      {
        name: "Lena V.",
        rating: 4,
        date: "2025-12-27",
        text: "Great bundle and generous with the strips. My six year old needed help with the basket, but the bird and flower were all hers.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 27. Woven Pencil Holder
  // ------------------------------------------------------------------
  {
    slug: "woven-pencil-holder",
    name: "Woven Pencil Holder",
    category: "kids-crafts",
    sku: "LC-KID-004",
    price: 15.0,
    salePrice: null,
    stock: 44,
    stockStatus: "in_stock",
    badge: "",
    rating: 4.4,
    reviewCount: 10,
    featured: false,
    shortDescription:
      "A tall, open-topped woven pot for pens, pencils and brushes, with a reinforced base so it does not tip when it is full. A natural desk tidy that suits a child's room or a studio, woven in one piece.",
    metaTitle: "Woven Palm Leaf Pencil Holder",
    metaDescription:
      "Tall handwoven palm leaf pencil holder with a reinforced base so it will not tip. A natural desk tidy for pens, pencils and brushes, plastic-free.",
    keywords: [
      "woven pencil holder",
      "palm leaf desk tidy",
      "natural pen pot",
      "handmade pencil pot",
      "kids desk organiser",
    ],
    tags: ["handmade", "kids", "desk"],
    material: "Natural palm leaf",
    weight: "160 g",
    dimensions: "9 x 9 x 12 cm",
    colour: "Green turning to straw",
    care: "Empty it and wipe dry if a pen leaks, and dust with a soft brush.",
    features: [
      "Tall enough for full-length pencils",
      "Reinforced base will not tip",
      "Open top fits brushes and rulers",
      "Woven in one continuous piece",
      "Compostable at end of life",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>A pencil pot is a simple thing until it tips over and spills everything across the desk. The fix is weight low down, so this one is woven with a doubled base and slightly thicker strips at the bottom rows.</p>",
      },
      { type: "heading", level: 3, text: "Woven to stay upright" },
      {
        type: "paragraph",
        html: "<p>The whole pot is one continuous weave from base to rim, with no join where a separate bottom would be attached. The lower third is woven more tightly than the top, which keeps the centre of gravity low and stops the pot from wobbling.</p>",
      },
      {
        type: "table",
        head: ["Detail", "Specification"],
        rows: [
          ["Size", "9 x 9 cm"],
          ["Height", "12 cm"],
          ["Base", "Doubled and tightly woven"],
          ["Rim", "Folded and tucked"],
        ],
      },
      {
        type: "list",
        items: [
          "Pens and pencils on a desk",
          "Paintbrushes in a studio",
          "Knitting needles and hooks",
          "Cutlery on a kitchen counter",
        ],
      },
      {
        type: "notice",
        tone: "info",
        text: "A good first project if you want to learn weaving yourself. It is essentially a small basket with straight sides.",
      },
    ],
    images: ["woven-pencil-holder"],
    reviews: [
      {
        name: "Beth A.",
        rating: 5,
        date: "2026-03-17",
        text: "Sits on my son's desk and has never tipped over, even when it is stuffed with pencils. Simple and nicely made.",
      },
      {
        name: "Kofi E.",
        rating: 4,
        date: "2025-11-05",
        text: "Neat little pot, good and sturdy. It is fairly small so it holds pens better than long rulers, but the weave is very tidy.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 28. Palm Leaf Home Starter Set
  // ------------------------------------------------------------------
  {
    slug: "palm-leaf-home-starter-set",
    name: "Palm Leaf Home Starter Set",
    category: "sets",
    sku: "LC-SET-001",
    price: 79.0,
    salePrice: 65.0,
    stock: 12,
    stockStatus: "in_stock",
    badge: "Best Value",
    rating: 4.9,
    reviewCount: 35,
    featured: true,
    shortDescription:
      "Our four most-used pieces in one set: the classic basket, the fruit bowl, the coasters and a bread basket. Everything you need to bring natural leaf into a kitchen, and it saves you money.",
    metaTitle: "Palm Leaf Home Starter Set of 4",
    metaDescription:
      "Palm leaf home starter set with our classic basket, fruit bowl, coaster set and bread basket. Four everyday pieces for the kitchen at a saving.",
    keywords: [
      "palm leaf starter set",
      "woven home set",
      "kitchen basket set",
      "palm leaf bundle",
      "natural home set",
    ],
    tags: ["handmade", "set", "kitchen"],
    material: "Natural palm leaf",
    weight: "1.2 kg",
    dimensions: "40 x 30 x 20 cm",
    colour: "Matched straw and green tones",
    care: "Dust each piece with a soft dry brush and keep the whole set out of prolonged direct sunlight.",
    features: [
      "Four everyday pieces in one set",
      "Classic basket, bowl, coasters and bread basket",
      "Matched tones woven from one batch",
      "Saves compared with buying separately",
      "Plastic-free packaging",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>If you are new to woven leaf, this is the set we would put in your hands. It covers the four jobs a natural basket actually does in a kitchen: storing, displaying fruit, serving bread and protecting the table.</p>",
      },
      { type: "heading", level: 3, text: "What is included" },
      {
        type: "paragraph",
        html: "<p>The set contains the Classic Palm Leaf Basket, the Woven Fruit Bowl, a Set of 4 Woven Coasters and the Shallow Bread Basket. We weave them from a single batch of leaf so the tones sit together on a shelf rather than clashing.</p>",
      },
      {
        type: "table",
        head: ["Piece", "Role"],
        rows: [
          ["Classic basket", "Storage"],
          ["Fruit bowl", "Display"],
          ["Coaster set", "Table protection"],
          ["Bread basket", "Serving"],
        ],
      },
      {
        type: "list",
        items: [
          "A new home or first kitchen",
          "A wedding or housewarming gift",
          "Replacing plastic storage",
          "A whole shelf of matched pieces",
        ],
      },
      {
        type: "notice",
        tone: "success",
        text: "Buying the four pieces together saves you around fifteen percent compared with the individual prices.",
      },
      {
        type: "quote",
        text: "Start with the pieces you will reach for every day, then add the rest.",
      },
      {
        type: "paragraph",
        html: "<p>Each set is packed in paper and card only. Nothing needs to be unwrapped and thrown away.</p>",
      },
    ],
    images: [
      "palm-leaf-home-starter-set",
      "classic-palm-leaf-basket",
      "woven-fruit-bowl",
    ],
    reviews: [
      {
        name: "Grace H.",
        rating: 5,
        date: "2026-04-22",
        text: "Bought this as a housewarming gift and it was perfect. Four useful pieces, beautifully matched, and the saving made it an easy choice.",
      },
      {
        name: "Anton P.",
        rating: 5,
        date: "2026-02-27",
        text: "Everything in the set gets used daily. The tones match exactly, which I did not expect, and the quality is excellent throughout.",
      },
      {
        name: "Mei L.",
        rating: 5,
        date: "2026-01-09",
        text: "A great way to start. I had been eyeing these pieces for months and the set price finally convinced me. No regrets at all.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 29. Dining Table Set
  // ------------------------------------------------------------------
  {
    slug: "dining-table-set",
    name: "Dining Table Set",
    category: "sets",
    sku: "LC-SET-002",
    price: 52.0,
    salePrice: null,
    stock: 14,
    stockStatus: "in_stock",
    badge: "Best Value",
    rating: 4.8,
    reviewCount: 23,
    featured: false,
    shortDescription:
      "A matched table setting for two: the placemat pair, a set of four coasters and the shallow bread basket. Laid together, the tones read as one quiet, natural table of seven pieces in total.",
    metaTitle: "Natural Dining Table Set for Two",
    metaDescription:
      "Natural dining table set with a woven placemat pair, four coasters and a bread basket. A matched handwoven table setting for two, plastic-free.",
    keywords: [
      "dining table set",
      "woven table setting",
      "placemat and coaster set",
      "natural table decor",
      "palm leaf table set",
    ],
    tags: ["handmade", "set", "table"],
    material: "Natural palm leaf",
    weight: "760 g",
    dimensions: "48 x 34 x 12 cm",
    colour: "Even straw with green lines",
    care: "Wipe the pieces with a dry cloth and stand the placemats on edge to air after use.",
    features: [
      "Matched set for a table for two",
      "Placemats, coasters and bread basket",
      "Fine weaves that lie flat",
      "Reads as one quiet table setting",
      "Plastic-free packaging",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>Mismatched table pieces are the small thing that stops a table looking considered. This set is woven to match: the same leaf, the same tone, the same fine weave across every piece, so the table reads as one setting rather than a collection.</p>",
      },
      { type: "heading", level: 3, text: "A setting for two" },
      {
        type: "paragraph",
        html: "<p>It contains two placemats, four coasters and the shallow bread basket. Two placemats cover a small dining table or a kitchen counter; the coasters handle drinks; the basket holds the bread. Together they set a table for two comfortably.</p>",
      },
      {
        type: "table",
        head: ["Piece", "Quantity"],
        rows: [
          ["Placemats", "2"],
          ["Coasters", "4"],
          ["Bread basket", "1"],
          ["Total pieces", "7"],
        ],
      },
      {
        type: "list",
        items: [
          "A kitchen table for two",
          "A small dining room",
          "A wedding or anniversary gift",
          "Everyday meals made a little nicer",
        ],
      },
      {
        type: "notice",
        tone: "info",
        text: "Need a larger table set? Order two of these and the pieces will match, since we weave them from the same batch.",
      },
      {
        type: "quote",
        text: "A table does not need much. It needs to look like someone thought about it.",
      },
    ],
    images: ["dining-table-set", "natural-placemat-pair", "woven-coasters-set"],
    reviews: [
      {
        name: "Isabelle R.",
        rating: 5,
        date: "2026-03-31",
        text: "Everything matches beautifully and the table finally looks put together. The placemats lie perfectly flat, which was my main worry.",
      },
      {
        name: "Tom W.",
        rating: 5,
        date: "2026-02-04",
        text: "Bought it for our anniversary and we use it every day. Good value for seven pieces and the bread basket gets the most use.",
      },
      {
        name: "Nina F.",
        rating: 4,
        date: "2025-11-24",
        text: "Lovely matched set, very well made. I would have liked a second bread basket, but for a table for two the balance is just right.",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 30. Craft Lover Gift Set
  // ------------------------------------------------------------------
  {
    slug: "craft-lover-gift-set",
    name: "Craft Lover Gift Set",
    category: "sets",
    sku: "LC-SET-003",
    price: 68.0,
    salePrice: 59.0,
    stock: 10,
    stockStatus: "in_stock",
    badge: "Small Batch",
    rating: 4.9,
    reviewCount: 30,
    featured: true,
    shortDescription:
      "A gift for someone who makes things: a beginner weaving kit, a woven gift box and a set of gift toppers, so they can learn the craft and then pass it on to someone else. Packed by hand in a small batch.",
    metaTitle: "Craft Lover Gift Set",
    metaDescription:
      "Craft lover gift set with a beginner weaving kit, a woven gift box and gift toppers. A thoughtful present for anyone who loves making things by hand.",
    keywords: [
      "craft gift set",
      "weaving gift set",
      "gift for crafters",
      "palm leaf gift set",
      "handmade gift bundle",
    ],
    tags: ["handmade", "set", "gift"],
    material: "Palm leaf, wood and cotton",
    weight: "1.1 kg",
    dimensions: "30 x 24 x 14 cm",
    colour: "Mixed green strips and straw",
    care: "Keep the kit strips sealed until used and store the finished pieces dry.",
    features: [
      "A kit to learn the craft",
      "A woven box to keep the results",
      "Gift toppers to pass the craft on",
      "Presented ready to give",
      "Plastic-free packaging",
    ],
    description: [
      {
        type: "paragraph",
        html: "<p>Some people would rather make a thing than be given one. This set is for them. It hands over the skill rather than the object, and it includes the means to wrap whatever they make next for somebody else.</p>",
      },
      { type: "heading", level: 3, text: "What is in the set" },
      {
        type: "paragraph",
        html: "<p>There is a Beginner Weaving Kit with pre-cut strips, a tool and a guide. There is a Woven Gift Box with a fitted lid, ready to hold finished pieces. And there is a Natural Gift Topper Set, three woven toppers for wrapping gifts the way the workshop does.</p>",
      },
      {
        type: "table",
        head: ["Piece", "Purpose"],
        rows: [
          ["Beginner weaving kit", "Learn the craft"],
          ["Woven gift box", "Store the results"],
          ["Gift topper set", "Wrap gifts naturally"],
          ["Guide", "Included in the kit"],
        ],
      },
      {
        type: "list",
        items: [
          "A birthday gift for a maker",
          "A retirement present",
          "A crafty teenager",
          "A thank-you for a teacher",
        ],
      },
      {
        type: "notice",
        tone: "info",
        text: "Made in a small batch, so stock is limited. Each set is packed by hand and we will add a gift card on request.",
      },
      {
        type: "quote",
        text: "The best craft gift is not a finished object. It is the ability to make one.",
      },
      {
        type: "paragraph",
        html: "<p>If you are sending it straight to the recipient, tell us in the order notes and we will leave the price off the packing slip.</p>",
      },
    ],
    images: [
      "craft-lover-gift-set",
      "beginner-weaving-kit-for-kids",
      "woven-gift-box-with-lid",
    ],
    reviews: [
      {
        name: "Carolyn S.",
        rating: 5,
        date: "2026-04-17",
        text: "A really thoughtful gift. My sister loved it and had made her first basket within a week. The packaging was beautiful too.",
      },
      {
        name: "Ade O.",
        rating: 5,
        date: "2026-02-21",
        text: "Everything is well made and the set feels considered rather than just bundled together. The gift toppers were a lovely surprise.",
      },
      {
        name: "Petra K.",
        rating: 5,
        date: "2025-12-14",
        text: "Bought it for my mother who crafts constantly. She said it was the best craft gift she had been given in years. High praise indeed.",
      },
    ],
  },
];
