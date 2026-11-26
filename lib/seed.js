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

const SEEDS = [
    { marker: 'seed:table-and-chair-v1', category: 'table-and-chair', products: TABLE_AND_CHAIR_V1 }
]

export const runSeeds = async (sql) => {
    for (const seed of SEEDS) {
        // Claim the marker first; only the request that inserts it adds the products.
        const claimed = await sql`
            INSERT INTO app_secrets (name, value) VALUES (${seed.marker}, 'done')
            ON CONFLICT (name) DO NOTHING
            RETURNING name`
        if (!claimed.length) continue
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
