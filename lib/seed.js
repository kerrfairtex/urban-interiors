// Server-only: one-time sample products so new categories aren't empty.
// Each batch runs once per database (tracked by a marker row in app_secrets),
// so editing or deleting these products later is never undone.
// Photos: Pexels (free commercial license) - see ./seed-photo-sources.md
const BROWN = { name: 'brown', value: '#8B4513' }
const WHITE = { name: 'white', value: '#FFFFFF' }
const BLACK = { name: 'matte black', value: '#090909' }

const TABLE_AND_CHAIR_V1 = [
    {
        productName: 'Classic Wooden Dining Set (6-Seater)',
        productPrice: 68000,
        subcategory: ['featured'],
        colors: [BROWN],
        width: 6, length: 3.5, height: 2.5,
        image: '/products/table-and-chair-01.jpg',
        desc: 'A timeless rectangular dining table with six high-back wooden chairs and cushioned seats. Made for family meals and everyday use, with a warm stained finish.'
    },
    {
        productName: 'Farmhouse Dining Table with Bench',
        productPrice: 52000,
        subcategory: ['trending'],
        colors: [BROWN],
        width: 6, length: 3, height: 2.5,
        image: '/products/table-and-chair-02.jpg',
        desc: 'Rustic farmhouse-style wooden dining table paired with a matching bench and cross-back chairs. Seats six comfortably and adds a cozy, homey feel to any dining area.'
    },
    {
        productName: 'Modern Wooden 4-Seater Dining Set',
        productPrice: 38500,
        subcategory: ['new arrival'],
        colors: [BROWN, WHITE],
        width: 5, length: 3, height: 2.5,
        image: '/products/table-and-chair-03.jpg',
        desc: 'Clean-lined wooden dining table with four slim chairs and light cushioned seats. A modern, space-friendly set for condos and smaller dining rooms.'
    },
    {
        productName: 'Live-Edge Wooden Dining Table',
        productPrice: 75000,
        subcategory: ['featured'],
        colors: [BROWN, BLACK],
        width: 7, length: 3.3, height: 2.5,
        image: '/products/table-and-chair-04.jpg',
        desc: 'A statement live-edge wooden tabletop that keeps the natural shape and grain of the wood, set on a sturdy matte black base. Each piece is one of a kind.'
    },
    {
        productName: 'Round Wooden Dining Set with White Chairs',
        productPrice: 29500,
        subcategory: ['on sale'],
        colors: [BROWN, WHITE],
        width: 3.5, length: 3.5, height: 2.5,
        image: '/products/table-and-chair-05.jpg',
        desc: 'A round wooden dining table with four white slat-back chairs and seat cushions. Bright and compact, perfect for breakfast nooks and small kitchens.'
    },
    {
        productName: 'Round Dining Table with Upholstered Chairs',
        productPrice: 34000,
        subcategory: ['trending'],
        colors: [BROWN],
        width: 4, length: 4, height: 2.5,
        image: '/products/table-and-chair-06.jpg',
        desc: 'Solid wooden round table with four wooden-frame chairs and padded fabric seats and backs. Comfortable for long meals and easy to fit into any room.'
    }
]

// Shared choice lists (prices are placeholder add-ons in PHP).
const STAINS = [
    { name: 'Natural', swatch: '#C8955C', price: 0 },
    { name: 'Honey Oak', swatch: '#B5742F', price: 0 },
    { name: 'Walnut', swatch: '#6B4226', price: 1500 },
    { name: 'Dark Mahogany', swatch: '#4A1F14', price: 1500 },
    { name: 'Ebony', swatch: '#2B211C', price: 2000 }
]
const FINISHES = [
    { name: 'Satin polyurethane', price: 0, note: 'Wipe-clean, resists water rings and scratches' },
    { name: 'Matte lacquer', price: 1500, note: 'Low-sheen, natural look' },
    { name: 'High-gloss lacquer', price: 3500, note: 'Mirror-like shine, 5 coats' },
    { name: 'Hand-rubbed oil & wax', price: 2500, note: 'Feels like bare wood; re-oil yearly' }
]

// Second batch: full specs, sizes, variants, stains, finishes, detail photo and 3D model
// for the six sample products. Only fills products whose details are still empty.
const TABLE_AND_CHAIR_DETAILS_V2 = {
    'Classic Wooden Dining Set (6-Seater)': {
        weight: 95,
        views: { detail: '/products/table-and-chair-01-detail.jpg' },
        model: 'dining-rect',
        wood: {
            species: 'Mahogany',
            construction: [
                'Solid mahogany tabletop, 30 mm thick, with a shaped edge',
                'Mortise-and-tenon joints between legs and apron',
                'Corner blocks glued and screwed under the top for extra stiffness',
                'Slat-back chairs with dowelled joints and removable fabric seat cushions'
            ]
        },
        size: [
            { name: '4-seater (150 cm)', price: -14000, width: 150, depth: 90, height: 76, weight: 70, seats: 4 },
            { name: '6-seater (180 cm)', price: 0, width: 180, depth: 100, height: 76, weight: 95, seats: 6 },
            { name: '8-seater (220 cm)', price: 18000, width: 220, depth: 105, height: 76, weight: 125, seats: 8 }
        ],
        variant: [
            { name: 'Table + chairs', price: 0 },
            { name: 'Table only', price: -24000, seats: 0 }
        ]
    },
    'Farmhouse Dining Table with Bench': {
        views: { detail: '/products/table-and-chair-02-detail.jpg' },
        model: 'dining-rect',
        wood: {
            species: 'Acacia',
            construction: [
                'Plank-style solid acacia top with breadboard ends',
                'Turned legs joined to a trestle stretcher with mortise-and-tenon joints',
                'Matching bench built with the same leg and stretcher joinery',
                'Cross-back chairs with dowelled and glued joints'
            ]
        },
        size: [
            { name: '6-seater (180 cm)', price: 0, width: 180, depth: 90, height: 76, weight: 85 },
            { name: '8-seater (220 cm)', price: 14000, width: 220, depth: 95, height: 76, weight: 110 }
        ],
        variant: [
            { name: 'Table + bench + 4 chairs', price: 0, seats: 4, bench: 1 },
            { name: 'Table + 6 chairs', price: 6000, seats: 6, bench: 0 },
            { name: 'Table + 2 benches', price: -5000, seats: 0, bench: 2 }
        ]
    },
    'Modern Wooden 4-Seater Dining Set': {
        views: { detail: '/products/table-and-chair-03-detail.jpg' },
        model: 'dining-rect',
        wood: {
            species: 'Gmelina',
            construction: [
                'Solid gmelina top with rounded edges',
                'Splayed trestle legs with mortise-and-tenon joints',
                'Curved-back chairs with padded, removable seats',
                'Pre-drilled for easy home assembly of the legs'
            ]
        },
        size: [
            { name: '4-seater (120 cm)', price: -4000, width: 120, depth: 75, height: 75, weight: 45 },
            { name: '4-seater (150 cm)', price: 0, width: 150, depth: 85, height: 75, weight: 55 },
            { name: '6-seater (180 cm)', price: 9500, width: 180, depth: 90, height: 75, weight: 72 }
        ],
        variant: [
            { name: 'Table + 4 chairs', price: 0, seats: 4 },
            { name: 'Table + 6 chairs', price: 8000, seats: 6 },
            { name: 'Table only', price: -16000, seats: 0 }
        ]
    },
    'Live-Edge Wooden Dining Table': {
        views: { detail: '/products/table-and-chair-04-detail.jpg' },
        model: 'live-edge',
        wood: {
            species: 'Acacia slab',
            construction: [
                'Kiln-dried acacia slab, 50 mm thick, natural live edge kept',
                'Bow-tie (butterfly) keys inlaid across natural cracks',
                'Powder-coated steel legs, bolted to threaded inserts',
                'Underside sealed to prevent warping'
            ]
        },
        size: [
            { name: '180 cm slab', price: -12000, width: 180, depth: 90, height: 76, weight: 80 },
            { name: '210 cm slab', price: 0, width: 210, depth: 100, height: 76, weight: 100 },
            { name: '240 cm slab', price: 16000, width: 240, depth: 105, height: 76, weight: 125 }
        ],
        variant: [
            { name: 'Table only', price: 0, seats: 0 },
            { name: 'Table + 6 chairs', price: 27000, seats: 6 }
        ]
    },
    'Round Wooden Dining Set with White Chairs': {
        views: { detail: '/products/table-and-chair-05-detail.jpg' },
        model: 'dining-round',
        wood: {
            species: 'Pine',
            construction: [
                'Solid pine round top with a rounded edge',
                'Single pedestal base with a weighted foot',
                'Slat-back chairs painted white, with tie-on seat cushions',
                'Dowelled and glued chair joints'
            ]
        },
        size: [
            { name: 'Ø 90 cm (4 seats)', price: 0, width: 90, depth: 90, height: 75, weight: 40 },
            { name: 'Ø 110 cm (4–5 seats)', price: 5500, width: 110, depth: 110, height: 75, weight: 48 }
        ],
        variant: [
            { name: 'Table + 4 chairs', price: 0, seats: 4 },
            { name: 'Table + 2 chairs', price: -6000, seats: 2 },
            { name: 'Table only', price: -12000, seats: 0 }
        ]
    },
    'Round Dining Table with Upholstered Chairs': {
        views: { detail: '/products/table-and-chair-06-detail.jpg' },
        model: 'dining-round-upholstered',
        wood: {
            species: 'Narra',
            construction: [
                'Solid narra round top on four legs with an apron',
                'Mortise-and-tenon leg-to-apron joints',
                'Chair frames in narra with padded fabric seat and back panels',
                'Felt pads on all feet to protect floors'
            ]
        },
        size: [
            { name: 'Ø 100 cm (4 seats)', price: 0, width: 100, depth: 100, height: 76, weight: 55 },
            { name: 'Ø 120 cm (6 seats)', price: 9000, width: 120, depth: 120, height: 76, weight: 72 }
        ],
        variant: [
            { name: 'Table + 4 chairs', price: 0, seats: 4 },
            { name: 'Table + 6 chairs', price: 9000, seats: 6 }
        ]
    }
}

const SEEDS = [
    { marker: 'seed:table-and-chair-v1', category: 'table-and-chair', products: TABLE_AND_CHAIR_V1 },
    { marker: 'seed:table-and-chair-details-v2', category: 'table-and-chair', details: TABLE_AND_CHAIR_DETAILS_V2 },
    // v2 briefly shipped with the two round sets' 3D models swapped; fix them unless edited since.
    {
        marker: 'seed:table-and-chair-round-models-fix', category: 'table-and-chair', models: {
            'Round Wooden Dining Set with White Chairs': ['dining-round-upholstered', 'dining-round'],
            'Round Dining Table with Upholstered Chairs': ['dining-round', 'dining-round-upholstered']
        }
    }
]

export const runSeeds = async (sql) => {
    for (const seed of SEEDS) {
        // Claim the marker first; only the request that inserts it adds the products.
        const claimed = await sql`
            INSERT INTO app_secrets (name, value) VALUES (${seed.marker}, 'done')
            ON CONFLICT (name) DO NOTHING
            RETURNING name`
        if (!claimed.length) continue
        if (seed.models) {
            for (const [name, [from, to]] of Object.entries(seed.models)) {
                await sql`
                    UPDATE products SET details = jsonb_set(details, '{model}', to_jsonb(${to}::text))
                    WHERE category = ${seed.category} AND product_name = ${name} AND details->>'model' = ${from}`
            }
            continue
        }
        if (seed.details) {
            for (const [name, d] of Object.entries(seed.details)) {
                const details = { stain: STAINS, finish: FINISHES, ...d }
                await sql`
                    UPDATE products SET details = ${JSON.stringify(details)}::jsonb
                    WHERE category = ${seed.category} AND product_name = ${name} AND details = '{}'::jsonb`
            }
            continue
        }
        for (const p of seed.products) {
            await sql`
                INSERT INTO products (product_name, product_price, category, subcategory, color, color_value,
                                      width, length, height, images, description)
                VALUES (${p.productName}, ${p.productPrice}, ${seed.category}, ${p.subcategory},
                        ${p.colors.map(c => c.name)}, ${p.colors.map(c => c.value)},
                        ${p.width}, ${p.length}, ${p.height}, ${[p.image]}, ${p.desc})`
        }
    }
}
