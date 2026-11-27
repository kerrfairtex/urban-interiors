// Server-only: one-time sample products so new categories aren't empty.
// Each batch runs once per database (tracked by a marker row in app_secrets),
// so editing or deleting these products later is never undone.
// Photos: Pexels (free commercial license) - see ./seed-photo-sources.md
const BROWN = { name: 'brown', value: '#8B4513' }
const WHITE = { name: 'white', value: '#FFFFFF' }
const BLACK = { name: 'matte black', value: '#090909' }
const BEIGE = { name: 'beige', value: '#D7C7A7' }
const CHARCOAL = { name: 'charcoal', value: '#3B3B3B' }
const OLIVE = { name: 'olive', value: '#6B6F4E' }
const CREAM = { name: 'cream', value: '#F0EAD9' }
const TAN = { name: 'tan', value: '#B98A5A' }
const GREY = { name: 'grey', value: '#9A9A9A' }
const IVORY = { name: 'ivory', value: '#F2EDE4' }
const CHOCOLATE = { name: 'chocolate brown', value: '#5A3825' }

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

// Sofa samples. Shapes, materials and dimensions follow publicly listed furniture
// specs; descriptions are original and photos are Pexels stock images (free commercial
// use): 19866401, 17678671, 2555635, 1841143, 16274689 on pexels.com/photo/.
const SOFA_V1 = [
    {
        productName: 'Modular Three-Piece Performance Fabric Sofa',
        productPrice: 50000,
        subcategory: ['featured'],
        colors: [BEIGE, CHARCOAL],
        width: 7.2, length: 3.1, height: 2.9,
        image: '/products/sofa-01.jpg',
        desc: 'A flexible three-seat sofa built around a corner-blocked frame and softly wrapped high-resiliency foam. The stain-resistant woven upholstery wipes clean, and the modular pieces can be rearranged as the room calls for.'
    },
    {
        productName: 'Cherry Wood Three-Seat Lounge Sofa',
        productPrice: 98000,
        subcategory: ['featured'],
        colors: [OLIVE, BEIGE],
        width: 7, length: 2.7, height: 3.1,
        image: '/products/sofa-02.jpg',
        desc: 'Solid cherry or walnut arms joined with exposed bridle joints frame a deep, soft seat. Feather-down cushions sit over an eight-way hand-tied spring base, giving this three-seater a generous, settled feel that improves with use.'
    },
    {
        productName: 'Solid Cherry Upholstered Sofa',
        productPrice: 86000,
        subcategory: ['new arrival'],
        colors: [CREAM, CHARCOAL],
        width: 8, length: 2.9, height: 2.9,
        image: '/products/sofa-03.jpg',
        desc: 'A clean-lined American cherry frame with a wide, low back and simply shaped arms. Choose a woven fabric or soft microsuede for the loose cushions; the wood is finished by hand so the natural grain stays visible.'
    },
    {
        productName: 'Wall-Hugger Reclining Loveseat',
        productPrice: 68000,
        subcategory: ['on sale'],
        colors: [TAN, CHARCOAL],
        width: 5, length: 3.1, height: 3.4,
        image: '/products/sofa-04.jpg',
        desc: 'A compact reclining loveseat that sits close to the wall without losing full recline. A drop-in coil spring system and high-density seat foam keep the support firm, while the mechanism tucks neatly into the base.'
    },
    {
        productName: 'Amish Hardwood Sofa with Reversible Cushions',
        productPrice: 92000,
        subcategory: ['trending'],
        colors: [BEIGE, BROWN],
        width: 6.4, length: 3.2, height: 3.25,
        image: '/products/sofa-05.jpg',
        desc: 'Hand-built on a solid hardwood frame with thick, reversible seat cushions that can be flipped to even out wear. Available in a tightly woven fabric or full-grain leather, with a squared silhouette that suits plain and formal rooms alike.'
    }
]

const SOFA_DETAILS_V1 = {
    'Modular Three-Piece Performance Fabric Sofa': {
        weight: 78,
        wood: {
            species: 'Pine and engineered wood',
            construction: [
                'Corner-blocked frame for rigidity',
                'High-resiliency foam cushions wrapped in poly fiber',
                'Stain-resistant woven upholstery that wipes clean',
                'Modular pieces lock together with hidden clips'
            ]
        },
        size: [
            { name: 'Two-piece (152 cm)', price: 0, width: 152, depth: 95, height: 89, weight: 55, seats: 2 },
            { name: 'Three-piece (218 cm)', price: 8000, width: 218, depth: 95, height: 89, weight: 78, seats: 3 },
            { name: 'Four-piece with chaise (274 cm)', price: 22000, width: 274, depth: 160, height: 89, weight: 105, seats: 4 }
        ],
        variant: [
            { name: 'Standard woven fabric', price: 0 },
            { name: 'Performance fabric', price: 6000, note: 'Stain-resistant and easy to clean' }
        ]
    },
    'Cherry Wood Three-Seat Lounge Sofa': {
        weight: 88,
        wood: {
            species: 'Cherry or walnut',
            construction: [
                'Exposed bridle joints on the arms, pinned for strength',
                'Eight-way hand-tied spring base',
                'Feather-down cushions over a foam core',
                'Hand-finished oil and wax surface'
            ]
        },
        size: [
            { name: 'Two-seat (122 cm)', price: 0, width: 122, depth: 81, height: 94, weight: 62, seats: 2 },
            { name: 'Three-seat (213 cm)', price: 20000, width: 213, depth: 81, height: 94, weight: 88, seats: 3 }
        ],
        variant: [
            { name: 'Fabric upholstery', price: 0 },
            { name: 'Leather upholstery', price: 28000 }
        ],
        stain: [
            { name: 'Natural cherry', price: 0 },
            { name: 'Walnut', price: 12000 }
        ]
    },
    'Solid Cherry Upholstered Sofa': {
        weight: 92,
        wood: {
            species: 'American cherry',
            construction: [
                'Solid cherry frame with mortise-and-tenon joints',
                'Loose seat and back cushions for easy cleaning',
                'Webbed suspension with high-density foam',
                'Hand-rubbed finish that keeps the grain open'
            ]
        },
        size: [
            { name: '216 cm three-seat', price: 0, width: 216, depth: 88, height: 89, weight: 78, seats: 3 },
            { name: '245 cm three-seat', price: 18000, width: 245, depth: 88, height: 89, weight: 92, seats: 3 }
        ],
        variant: [
            { name: 'Woven fabric', price: 0 },
            { name: 'Microsuede', price: 4000 }
        ],
        stain: [
            { name: 'Natural cherry', price: 0 },
            { name: 'Natural walnut', price: 14000 }
        ]
    },
    'Wall-Hugger Reclining Loveseat': {
        weight: 70,
        wood: {
            species: 'Solid hardwood',
            construction: [
                'Drop-in coil spring system',
                'High-resilience 2.6-density seat foam',
                'Wall-hugger mechanism that reclines with minimal clearance',
                'Reinforced hardwood frame with corner blocks'
            ]
        },
        size: [
            { name: 'Loveseat (152 cm)', price: 0, width: 152, depth: 94, height: 103, weight: 70, seats: 2 },
            { name: 'Sofa (183 cm)', price: 14000, width: 183, depth: 94, height: 103, weight: 84, seats: 3 }
        ],
        variant: [
            { name: 'Manual recline', price: 0 },
            { name: 'Power recline', price: 12000 }
        ]
    },
    'Amish Hardwood Sofa with Reversible Cushions': {
        weight: 86,
        wood: {
            species: 'Solid hardwood',
            construction: [
                'Mortise-and-tenon frame, hand-joined',
                'Reversible 18 cm seat cushions',
                'High-density foam wrapped in fiber',
                'Hand-applied stain and lacquer finish'
            ]
        },
        size: [
            { name: '196 cm three-seat', price: 0, width: 196, depth: 97, height: 99, weight: 74, seats: 3 },
            { name: '216 cm three-seat', price: 10000, width: 216, depth: 97, height: 99, weight: 86, seats: 3 }
        ],
        variant: [
            { name: 'Woven fabric', price: 0 },
            { name: 'Full-grain leather', price: 16000 }
        ],
        stain: [
            { name: 'Natural', price: 0 },
            { name: 'Dark mahogany', price: 2500 }
        ]
    }
}

// Second sofa batch: more silhouettes, with a wider spread of sizes and design
// variants. Photos are Pexels stock (free commercial use): 16546595, 189333,
// 6510974, 276566, 11112731 on pexels.com/photo/.
const SOFA_V2 = [
    {
        productName: 'Button-Tufted Chesterfield Sofa',
        productPrice: 118000,
        subcategory: ['featured'],
        colors: [CHARCOAL, BROWN],
        width: 6.7, length: 3.2, height: 2.8,
        image: '/products/sofa-06.jpg',
        desc: 'Deep diamond tufting and rolled arms give this Chesterfield its familiar, formal shape. Pocket-coil seating keeps the tall back comfortable, and the solid wood frame is built to carry the heavy upholstery without sagging.'
    },
    {
        productName: 'Solid Wood Arm Two-Seat Sofa',
        productPrice: 74000,
        subcategory: ['new arrival'],
        colors: [TAN, CREAM],
        width: 5, length: 2.9, height: 2.9,
        image: '/products/sofa-07.jpg',
        desc: 'Exposed solid wood arms frame a neatly upholstered seat, so the frame reads as furniture rather than hiding under fabric. The joinery is pinned and glued, and the wood is stained by hand to bring out the grain.'
    },
    {
        productName: 'Modular Sectional Sofa with Chaise',
        productPrice: 96000,
        subcategory: ['trending'],
        colors: [GREY, BEIGE],
        width: 9, length: 6, height: 2.8,
        image: '/products/sofa-08.jpg',
        desc: 'A sectional that grows with the room: each module locks to the next, so an L-shape can become a U-shape later. Loose cushions are easy to fluff and clean, and the chaise can be placed on either side.'
    },
    {
        productName: 'Leather L-Sectional Sofa',
        productPrice: 128000,
        subcategory: ['featured'],
        colors: [CHOCOLATE, CHARCOAL],
        width: 8.3, length: 5.3, height: 2.9,
        image: '/products/sofa-09.jpg',
        desc: 'A low, clean-lined sectional in smooth leather with a long chaise for stretching out. Slim metal legs keep the heavy frame visually light, while adjustable headrests let each seat sit upright or reclined.'
    },
    {
        productName: 'Compact Tufted Loveseat',
        productPrice: 48000,
        subcategory: ['on sale'],
        colors: [TAN, IVORY],
        width: 4.6, length: 2.8, height: 3,
        image: '/products/sofa-10.jpg',
        desc: 'A small-grid tufted loveseat made for apartments and tight living rooms. The single plush seat cushion and curved arms keep the footprint modest, while tapered wooden legs lift the frame off the floor.'
    }
]

const SOFA_DETAILS_V2 = {
    'Button-Tufted Chesterfield Sofa': {
        weight: 95,
        wood: {
            species: 'Kiln-dried hardwood',
            construction: [
                'Diamond button-tufted back and rolled arms',
                'Pocket-coil seat base with a foam and fiber wrap',
                'Corner-blocked hardwood frame',
                'Tapered solid wood legs'
            ]
        },
        size: [
            { name: 'Two-seat (140 cm)', price: 0, width: 140, depth: 90, height: 88, weight: 68, seats: 2 },
            { name: 'Three-seat (205 cm)', price: 24000, width: 205, depth: 95, height: 88, weight: 95, seats: 3 },
            { name: 'Four-seat (245 cm)', price: 42000, width: 245, depth: 95, height: 88, weight: 118, seats: 4 }
        ],
        variant: [
            { name: 'Velvet upholstery', price: 0 },
            { name: 'Top-grain leather', price: 22000 },
            { name: 'Leather with nailhead trim', price: 28000 }
        ]
    },
    'Solid Wood Arm Two-Seat Sofa': {
        weight: 60,
        wood: {
            species: 'Solid oak or walnut',
            construction: [
                'Pinned and glued exposed wood arms',
                'Webbed suspension with removable seat cushions',
                'Hand-stained and lacquered wood surfaces',
                'High-density foam wrapped in polyester fiber'
            ]
        },
        size: [
            { name: 'Two-seat (122 cm)', price: 0, width: 122, depth: 85, height: 88, weight: 48, seats: 2 },
            { name: 'Three-seat (152 cm)', price: 9000, width: 152, depth: 88, height: 88, weight: 60, seats: 3 },
            { name: 'Three-seat wide (183 cm)', price: 18000, width: 183, depth: 88, height: 88, weight: 72, seats: 3 }
        ],
        variant: [
            { name: 'Open wood arms', price: 0 },
            { name: 'Upholstered arm panels', price: 6000 },
            { name: 'Sofa with matching ottoman', price: 12000 }
        ],
        stain: [
            { name: 'Natural oak', price: 0 },
            { name: 'Walnut', price: 2500 }
        ]
    },
    'Modular Sectional Sofa with Chaise': {
        weight: 110,
        wood: {
            species: 'Pine frame and engineered wood',
            construction: [
                'Hidden clips lock modules into L or U layouts',
                'Loose reversible seat and back cushions',
                'High-resiliency foam under a woven fabric cover',
                'Reinforced corner blocks at every joint'
            ]
        },
        size: [
            { name: 'Three-piece L (274 x 180 cm)', price: 0, width: 274, depth: 180, height: 86, weight: 90, seats: 4 },
            { name: 'Four-piece U (320 x 200 cm)', price: 18000, width: 320, depth: 200, height: 86, weight: 125, seats: 5 },
            { name: 'Five-piece corner (360 x 240 cm)', price: 32000, width: 360, depth: 240, height: 86, weight: 155, seats: 6 }
        ],
        variant: [
            { name: 'Left-hand chaise', price: 0 },
            { name: 'Right-hand chaise', price: 0 },
            { name: 'Reversible chaise', price: 6000 }
        ]
    },
    'Leather L-Sectional Sofa': {
        weight: 120,
        wood: {
            species: 'Hardwood frame',
            construction: [
                'Low-profile L-frame with a long chaise',
                'Sinuous spring suspension',
                'Slim angled metal legs',
                'Adjustable padded headrests'
            ]
        },
        size: [
            { name: 'Three-seat L (254 cm)', price: 0, width: 254, depth: 160, height: 88, weight: 100, seats: 4 },
            { name: 'Four-seat L (300 cm)', price: 22000, width: 300, depth: 180, height: 88, weight: 120, seats: 5 },
            { name: 'U-shape (330 cm)', price: 38000, width: 330, depth: 200, height: 88, weight: 142, seats: 6 }
        ],
        variant: [
            { name: 'Standard leather', price: 0 },
            { name: 'Top-grain leather', price: 18000 },
            { name: 'Top-grain with adjustable headrests', price: 27000 }
        ]
    },
    'Compact Tufted Loveseat': {
        weight: 42,
        wood: {
            species: 'Rubberwood',
            construction: [
                'Grid-tufted backrest with a single boxed seat cushion',
                'Curved, rolled arms with rounded edges',
                'Tapered wooden legs on a solid wood base',
                'High-density foam over a webbed seat'
            ]
        },
        size: [
            { name: 'Two-seat (140 cm)', price: 0, width: 140, depth: 85, height: 90, weight: 42, seats: 2 },
            { name: 'Three-seat (180 cm)', price: 9000, width: 180, depth: 88, height: 90, weight: 54, seats: 3 }
        ],
        variant: [
            { name: 'Standard sofa', price: 0 },
            { name: 'Pull-out sofa bed', price: 12000 },
            { name: 'Lift-up storage base', price: 8000 }
        ]
    }
}

// Third sofa batch: wooden-frame designs. Sizes and materials are grounded in the
// referenced catalog pages (facts only; descriptions and photos are original/licensed):
//   - Thos. Moser Vita:        https://www.thosmoser.com/product/vita-sofa-three-place/
//   - Thos. Moser Wing:        https://www.thosmoser.com/products/wing-sofa-three-place
//   - Countryside Girard Park: https://www.countrysideamishfurniture.com/product/girard-park-sofa
//   - Countryside Casselberry: https://www.countrysideamishfurniture.com/product/casselberry-reclaimed-sofa
//   - Vermont Woods Sierra:    https://vermontwoodsstudios.com/products/sierra-upholstered-sofa
// Photos: Pexels stock (free commercial use) 39134569, 39134600, 39134599,
// 39134561, 7088261 on pexels.com/photo/.
const SOFA_V3 = [
    {
        productName: 'Slatted Hardwood Frame Sofa',
        productPrice: 112000,
        subcategory: ['featured'],
        colors: [BROWN, BEIGE],
        width: 6, length: 3, height: 2.9,
        image: '/products/sofa-11.jpg',
        desc: 'A low wooden sofa where the structure is the decoration: vertical slats form the back and solid planks make the seat. Loose cushions soften the frame without hiding its joinery, giving the piece a calm, architectural look.'
    },
    {
        productName: 'Block-Arm Solid Wood Sofa',
        productPrice: 124000,
        subcategory: ['featured'],
        colors: [CHOCOLATE, CREAM],
        width: 6.6, length: 2.8, height: 3,
        image: '/products/sofa-14.jpg',
        desc: 'Thick rectangular wood arms give this sofa a grounded, sculptural outline. The frame is hand-finished so the grain remains visible, while deep upholstered cushions keep the seating soft and practical for everyday use.'
    },
    {
        productName: 'Raised-Panel Oak Sofa',
        productPrice: 86000,
        subcategory: ['new arrival'],
        colors: [TAN, IVORY],
        width: 6.8, length: 3.4, height: 2.8,
        image: '/products/sofa-12.jpg',
        desc: 'Raised wood panels and a slatted side extension give this oak sofa a hand-built feel. A thick seat cushion and two loose backs sit inside the frame, so the wood stays on show while the seating stays comfortable.'
    },
    {
        productName: 'Reclaimed Timber Sofa',
        productPrice: 96000,
        subcategory: ['trending'],
        colors: [BROWN, GREY],
        width: 6.3, length: 2.9, height: 3.4,
        image: '/products/sofa-13.jpg',
        desc: 'Built from reclaimed hardwood with a dark, varied grain, this sofa carries the character of older timber into a clean modern frame. The tall back and solid side panel contrast with soft woven cushions and a slim wooden base.'
    },
    {
        productName: 'Wood-Frame Lounge Sofa',
        productPrice: 104000,
        subcategory: ['on sale'],
        colors: [CHARCOAL, TAN],
        width: 7.5, length: 3, height: 3,
        image: '/products/sofa-15.jpg',
        desc: 'Dark upholstery framed by warm exposed wood makes this lounge sofa feel both tailored and natural. Generous seat and back cushions sit within a low wooden shell, with the arms and legs left visible to show the frame.'
    }
]

const SOFA_DETAILS_V3 = {
    'Slatted Hardwood Frame Sofa': {
        weight: 82,
        wood: {
            species: 'Solid cherry or walnut',
            construction: [
                'Vertical hardwood slats form the backrest',
                'Solid plank seat platform with corner blocks',
                'Loose fabric cushions over high-density foam',
                'Hand-rubbed oil finish on the exposed frame'
            ]
        },
        size: [
            { name: 'Two-seat (152 cm)', price: 0, width: 152, depth: 85, height: 74, weight: 62, seats: 2 },
            { name: 'Three-seat (175 cm)', price: 18000, width: 175, depth: 88, height: 74, weight: 82, seats: 3 }
        ],
        variant: [
            { name: 'Fabric cushions', price: 0 },
            { name: 'Leather cushions', price: 24000 }
        ],
        stain: [
            { name: 'Natural cherry', price: 0 },
            { name: 'Walnut', price: 6000 }
        ]
    },
    'Block-Arm Solid Wood Sofa': {
        weight: 95,
        wood: {
            species: 'Cherry or walnut',
            construction: [
                'Thick block arms cut from solid hardwood',
                'Mortise-and-tenon joints pinned for strength',
                'Four-inch foam and feather cushions',
                'Hand-finished exposed wood surfaces'
            ]
        },
        size: [
            { name: 'Two-seat (122 cm)', price: 0, width: 122, depth: 86, height: 91, weight: 70, seats: 2 },
            { name: 'Three-seat (201 cm)', price: 26000, width: 201, depth: 86, height: 91, weight: 95, seats: 3 }
        ],
        variant: [
            { name: 'Woven fabric', price: 0 },
            { name: 'Top-grain leather', price: 30000 }
        ],
        stain: [
            { name: 'Natural cherry', price: 0 },
            { name: 'Walnut', price: 8000 }
        ]
    },
    'Raised-Panel Oak Sofa': {
        weight: 88,
        wood: {
            species: 'Solid oak',
            construction: [
                'Raised panels set into a solid oak frame',
                'Slatted side extension with a low back',
                'Removable seat and back cushions',
                'Hand-applied stain and lacquer finish'
            ]
        },
        size: [
            { name: 'Two-seat (152 cm)', price: 0, width: 152, depth: 92, height: 86, weight: 68, seats: 2 },
            { name: 'Three-seat (207 cm)', price: 20000, width: 207, depth: 103, height: 86, weight: 88, seats: 3 }
        ],
        variant: [
            { name: 'Woven fabric', price: 0 },
            { name: 'Microsuede', price: 5000 },
            { name: 'Full-grain leather', price: 26000 }
        ],
        stain: [
            { name: 'Natural oak', price: 0 },
            { name: 'Dark walnut', price: 4000 }
        ]
    },
    'Reclaimed Timber Sofa': {
        weight: 92,
        wood: {
            species: 'Reclaimed hardwood',
            construction: [
                'Reclaimed boards with natural grain variation',
                'Solid side panel and tall slatted back',
                'High-density foam wrapped in woven fabric',
                'Low solid wood base with block feet'
            ]
        },
        size: [
            { name: 'Two-seat (150 cm)', price: 0, width: 150, depth: 89, height: 104, weight: 72, seats: 2 },
            { name: 'Three-seat (193 cm)', price: 22000, width: 193, depth: 89, height: 104, weight: 92, seats: 3 }
        ],
        variant: [
            { name: 'Fabric upholstery', price: 0 },
            { name: 'Leather upholstery', price: 28000 }
        ],
        stain: [
            { name: 'Natural reclaimed', price: 0 },
            { name: 'Espresso stain', price: 3500 }
        ]
    },
    'Wood-Frame Lounge Sofa': {
        weight: 105,
        wood: {
            species: 'Cherry or walnut',
            construction: [
                'Exposed wood arms and low wooden shell',
                'Upholstered panels set inside the frame',
                'High-resiliency foam over webbed suspension',
                'Hand-finished wood with a protective lacquer'
            ]
        },
        size: [
            { name: 'Three-seat (190 cm)', price: 0, width: 190, depth: 88, height: 89, weight: 88, seats: 3 },
            { name: 'Three-seat wide (245 cm)', price: 20000, width: 245, depth: 88, height: 89, weight: 105, seats: 3 }
        ],
        variant: [
            { name: 'Fabric upholstery', price: 0 },
            { name: 'Microsuede upholstery', price: 5000 },
            { name: 'Leather upholstery', price: 26000 }
        ],
        stain: [
            { name: 'Natural cherry', price: 0 },
            { name: 'Walnut', price: 7000 }
        ]
    }
}

// Dining room sets. Styles, wood options, table sizes and leaf sizes follow publicly
// listed specs (facts only; descriptions are original):
//   - Countryside Amish Furniture dining room sets:
//     https://www.countrysideamishfurniture.com/products/dining-room-sets
//     (Attalla Rustic, Oklahoma, Huntington, Shalimar and Hurley sets)
// Photos: Pexels stock (free commercial use) 4044798, 7195598, 3935313, 8113036,
// 1571463, 8583865 on pexels.com/photo/.
const DINING_ROOM_SET_V1 = [
    {
        productName: 'Farmhouse Dining Set with Bench',
        productPrice: 78000,
        subcategory: ['featured'],
        colors: [BROWN, BLACK],
        width: 6, length: 3.5, height: 2.5,
        image: '/products/dining-room-set-01.jpg',
        desc: 'A thick-topped farmhouse table on painted turned legs, paired with a long matching bench on one side and chairs on the other. The bench tucks fully under the table, so the set seats a crowd at dinner and stays out of the way the rest of the day.'
    },
    {
        productName: 'Round Pedestal Expansion Dining Set',
        productPrice: 96000,
        subcategory: ['new arrival'],
        colors: [CHOCOLATE, CREAM],
        width: 4, length: 4, height: 2.5,
        image: '/products/dining-room-set-02.jpg',
        desc: 'A round table on a single fluted pedestal, so no legs get in the way of anyone’s knees. Add leaves to stretch it into an oval for guests, and pull up the button-tufted upholstered chairs for long, comfortable dinners.'
    },
    {
        productName: 'Butterfly-Leaf Leg Table Dining Set',
        productPrice: 64000,
        subcategory: ['trending'],
        colors: [TAN],
        width: 5, length: 3.5, height: 2.5,
        image: '/products/dining-room-set-03.jpg',
        desc: 'A sturdy four-leg kitchen table with a leaf that folds out from inside the table itself, so there is nothing to store in a closet. Ladder-back chairs with tie-on seat cushions keep the look warm and casual.'
    },
    {
        productName: 'French Country Cherry Dining Set',
        productPrice: 88000,
        subcategory: ['featured'],
        colors: [CHOCOLATE],
        width: 6, length: 3.5, height: 2.5,
        image: '/products/dining-room-set-04.jpg',
        desc: 'A solid cherry table with a hand-applied stain that deepens with age, set with curved bentwood-style chairs. Simple, softly rounded lines give it a relaxed French country feel that suits both everyday meals and special occasions.'
    },
    {
        productName: 'Modern Round Dining Set with Upholstered Chairs',
        productPrice: 46000,
        subcategory: ['on sale'],
        colors: [IVORY, OLIVE],
        width: 3.5, length: 3.5, height: 2.5,
        image: '/products/dining-room-set-05.jpg',
        desc: 'A light-toned round table on a solid column base with four upholstered chairs on slim legs. Compact and bright, it fits an open-plan living area or a condo dining nook without crowding the room.'
    },
    {
        productName: 'Classic Single-Pedestal Breakfast Set',
        productPrice: 42000,
        subcategory: ['trending'],
        colors: [BROWN],
        width: 3.5, length: 3.5, height: 2.5,
        image: '/products/dining-room-set-06.jpg',
        desc: 'A round breakfast table on a carved single pedestal with splayed feet, paired with spindle-back side chairs. Small enough for a bay window or kitchen corner, with room to add leaves when family comes over.'
    }
]

const DINING_ROOM_SET_DETAILS_V1 = {
    'Farmhouse Dining Set with Bench': {
        weight: 110,
        model: 'dining-rect',
        wood: {
            species: 'Solid maple (rough-sawn or smooth)',
            construction: [
                '45 mm thick solid tabletop',
                'Turned legs joined to the apron with mortise-and-tenon joints',
                'Matching bench built to slide fully under the table',
                'Low-sheen conversion varnish that resists spills and heat'
            ]
        },
        size: [
            { name: '6-seater (183 cm)', price: 0, width: 183, depth: 107, height: 76, weight: 110, seats: 4 },
            { name: '8-seater (213 cm)', price: 14000, width: 213, depth: 107, height: 76, weight: 132, seats: 6 },
            { name: '10-seater (244 cm)', price: 26000, width: 244, depth: 107, height: 76, weight: 150, seats: 8 }
        ],
        variant: [
            { name: 'Table + bench + chairs', price: 0, bench: 1 },
            { name: 'Table + 2 benches', price: -8000, seats: 0, bench: 2 },
            { name: 'Table + chairs only', price: 4000, bench: 0 }
        ]
    },
    'Round Pedestal Expansion Dining Set': {
        weight: 98,
        model: 'dining-round-upholstered',
        wood: {
            species: 'Oak, brown maple, elm or cherry',
            construction: [
                'Single fluted pedestal base, no corner legs',
                'Self-storing leaves, each adding 28 cm',
                'Button-tufted upholstered chairs on solid wood legs',
                'Catalyzed conversion varnish top coat'
            ]
        },
        size: [
            { name: '122 cm round, seats 4', price: 0, width: 122, depth: 122, height: 76, weight: 98, seats: 4 },
            { name: '122 cm + 1 leaf (150 cm oval), seats 6', price: 9000, width: 150, depth: 122, height: 76, weight: 112, seats: 6 },
            { name: '122 cm + 2 leaves (178 cm oval), seats 6', price: 16000, width: 178, depth: 122, height: 76, weight: 124, seats: 6 }
        ],
        variant: [
            { name: 'Fabric upholstery', price: 0 },
            { name: 'Leather upholstery', price: 22000 }
        ]
    },
    'Butterfly-Leaf Leg Table Dining Set': {
        weight: 72,
        model: 'dining-rect',
        wood: {
            species: 'Oak, brown maple, hickory or walnut',
            construction: [
                'Butterfly leaf folds out from inside the table',
                '25 mm thick top with rounded corners',
                'Turned legs with leg levelers',
                'Ladder-back chairs with tie-on seat cushions'
            ]
        },
        size: [
            { name: '107 × 122 cm, seats 4', price: 0, width: 122, depth: 107, height: 76, weight: 72, seats: 4 },
            { name: '107 × 152 cm, seats 6', price: 8000, width: 152, depth: 107, height: 76, weight: 84, seats: 6 },
            { name: '122 × 183 cm, seats 6', price: 16000, width: 183, depth: 122, height: 76, weight: 98, seats: 6 }
        ],
        variant: [
            { name: 'Table + chairs', price: 0 },
            { name: 'Table only', price: -18000, seats: 0 }
        ]
    },
    'French Country Cherry Dining Set': {
        weight: 96,
        model: 'dining-rect',
        wood: {
            species: 'Solid cherry',
            construction: [
                'Hand-applied stain over solid cherry',
                'Up to four centre leaves on wooden slides',
                'Curved-back chairs with fabric or leather seats',
                'Catalyzed conversion varnish top coat'
            ]
        },
        size: [
            { name: '152 cm, seats 4', price: 0, width: 152, depth: 97, height: 76, weight: 80, seats: 4 },
            { name: '183 cm, seats 6', price: 12000, width: 183, depth: 97, height: 76, weight: 96, seats: 6 },
            { name: '213 cm, seats 8', price: 24000, width: 213, depth: 97, height: 76, weight: 114, seats: 8 }
        ],
        variant: [
            { name: 'Fabric chair seats', price: 0 },
            { name: 'Leather chair seats', price: 14000 }
        ]
    },
    'Modern Round Dining Set with Upholstered Chairs': {
        weight: 58,
        model: 'dining-round-upholstered',
        wood: {
            species: 'Ash with a light natural finish',
            construction: [
                'Solid column base for a steady, leg-free table',
                'Upholstered shell chairs on slim tapered legs',
                'Stain-resistant woven chair fabric',
                'Satin lacquer top that wipes clean'
            ]
        },
        size: [
            { name: '100 cm round, seats 4', price: 0, width: 100, depth: 100, height: 75, weight: 58, seats: 4 },
            { name: '120 cm round, seats 4', price: 6000, width: 120, depth: 120, height: 75, weight: 66, seats: 4 }
        ],
        variant: [
            { name: 'Table + 4 chairs', price: 0 },
            { name: 'Table + 2 chairs', price: -9000, seats: 2 }
        ]
    },
    'Classic Single-Pedestal Breakfast Set': {
        weight: 52,
        model: 'dining-round',
        wood: {
            species: 'Oak, brown maple or cherry',
            construction: [
                'Single pedestal with four splayed feet',
                'Optional 30 cm leaf turns the round top into an oval',
                'Spindle-back side chairs with shaped wooden seats',
                'Hand-rubbed stain under a satin top coat'
            ]
        },
        size: [
            { name: '91 cm round, seats 2', price: 0, width: 91, depth: 91, height: 76, weight: 42, seats: 2 },
            { name: '107 cm round, seats 4', price: 7000, width: 107, depth: 107, height: 76, weight: 52, seats: 4 },
            { name: '107 cm + 1 leaf (137 cm oval), seats 4', price: 12000, width: 137, depth: 107, height: 76, weight: 60, seats: 4 }
        ],
        variant: [
            { name: 'Table + chairs', price: 0 },
            { name: 'Table only', price: -12000, seats: 0 }
        ]
    }
}

// Second dining set batch. Styles and specs follow the same Countryside Amish Furniture
// listings (Hurley Mission, Attalla Rustic, Harding Craftsman, Huntington); descriptions
// are original. Photos: Pexels stock (free commercial use) 37184165, 35419454, 4469149,
// 3935311, 269262, 3288102 on pexels.com/photo/.
const DINING_ROOM_SET_V2 = [
    {
        productName: 'Mission Slat-Back Dining Set',
        productPrice: 92000,
        subcategory: ['featured'],
        colors: [TAN],
        width: 6, length: 3.5, height: 2.5,
        image: '/products/dining-room-set-07.jpg',
        desc: 'Straight lines, square legs and tall slatted chair backs give this set its honest Mission character. The honey-toned oak shows off its grain, and the table opens with leaves for holiday dinners.'
    },
    {
        productName: 'Industrial Plank Table with Bench',
        productPrice: 58000,
        subcategory: ['trending'],
        colors: [TAN, BLACK],
        width: 6.5, length: 3.3, height: 2.5,
        image: '/products/dining-room-set-08.jpg',
        desc: 'A wide plank-top table with a parquet-style pattern, set on a black steel frame and paired with a matching bench and metal-framed chairs. Tough, easy to wipe down and made for busy households.'
    },
    {
        productName: 'Traditional Oval Dining Set with China Hutch',
        productPrice: 165000,
        subcategory: ['featured'],
        colors: [CHOCOLATE],
        width: 6, length: 3.5, height: 6.5,
        image: '/products/dining-room-set-09.jpg',
        desc: 'A complete formal dining room: an oval pedestal table, carved-back chairs with padded seats, and a tall china hutch with glass doors and drawers below. Rich cherry tones and classic mouldings tie the pieces together.'
    },
    {
        productName: 'Two-Tone Dining Set with Cane-Back Chairs',
        productPrice: 72000,
        subcategory: ['new arrival'],
        colors: [CHOCOLATE, TAN],
        width: 5.5, length: 3.3, height: 2.5,
        image: '/products/dining-room-set-10.jpg',
        desc: 'A dark-stained table on turned legs, matched with lighter woven cane-back chairs for a relaxed two-tone look. The cane lets light through so the set feels open even in a smaller dining room.'
    },
    {
        productName: 'Rustic Trestle Table with Wicker Chairs',
        productPrice: 68000,
        subcategory: ['on sale'],
        colors: [BROWN, BEIGE],
        width: 6, length: 3.3, height: 2.5,
        image: '/products/dining-room-set-11.jpg',
        desc: 'A heavy rustic table on chunky trestle-style legs, surrounded by high-back woven wicker chairs. Natural textures and a weathered finish make it a warm centrepiece for an open-plan living and dining space.'
    },
    {
        productName: 'Drop-Leaf Table with Ladder-Back Chairs',
        productPrice: 36000,
        subcategory: ['on sale'],
        colors: [BROWN],
        width: 3, length: 3, height: 2.5,
        image: '/products/dining-room-set-12.jpg',
        desc: 'A space-saving table with hinged leaves that fold down against the sides, so it can sit against a wall as a narrow console and open up when it is time to eat. Two classic ladder-back chairs with woven seats complete the set.'
    }
]

const DINING_ROOM_SET_DETAILS_V2 = {
    'Mission Slat-Back Dining Set': {
        weight: 105,
        model: 'dining-rect',
        wood: {
            species: 'Oak, quartersawn white oak, cherry or walnut',
            construction: [
                'Square legs joined with mortise-and-tenon joints',
                'Up to four 30 cm leaves on gear-equalizing wood slides',
                'Slatted chair backs with shaped solid wood seats',
                '25 mm thick top with a choice of edge profiles'
            ]
        },
        size: [
            { name: '107 × 168 cm, seats 6', price: 0, width: 168, depth: 107, height: 76, weight: 105, seats: 6 },
            { name: '122 × 183 cm, seats 6', price: 9000, width: 183, depth: 122, height: 76, weight: 118, seats: 6 },
            { name: '122 × 244 cm, seats 8', price: 24000, width: 244, depth: 122, height: 76, weight: 140, seats: 8 }
        ],
        variant: [
            { name: 'Wooden chair seats', price: 0 },
            { name: 'Fabric chair seats', price: 6000 },
            { name: 'Leather chair seats', price: 15000 }
        ]
    },
    'Industrial Plank Table with Bench': {
        weight: 92,
        model: 'dining-rect',
        wood: {
            species: 'Solid acacia planks',
            construction: [
                'Parquet-pattern plank top, 40 mm thick',
                'Powder-coated black steel frame and stretchers',
                'Matching bench on the same steel frame',
                'Clear matte lacquer that resists spills'
            ]
        },
        size: [
            { name: '183 cm, seats 6', price: 0, width: 183, depth: 100, height: 76, weight: 92, seats: 4 },
            { name: '213 cm, seats 8', price: 11000, width: 213, depth: 100, height: 76, weight: 108, seats: 6 }
        ],
        variant: [
            { name: 'Table + bench + chairs', price: 0, bench: 1 },
            { name: 'Table + 2 benches', price: -6000, seats: 0, bench: 2 }
        ]
    },
    'Traditional Oval Dining Set with China Hutch': {
        weight: 240,
        model: 'dining-round',
        wood: {
            species: 'Solid cherry or brown maple',
            construction: [
                'Oval double-pedestal table with one 30 cm leaf',
                'Carved-back chairs with padded fabric seats',
                'Two-piece china hutch with glass doors and interior light',
                'Full-extension dovetailed drawers in the hutch base'
            ]
        },
        size: [
            { name: 'Table 107 × 152 cm, seats 6', price: 0, width: 152, depth: 107, height: 76, weight: 240, seats: 6 },
            { name: 'Table 107 × 183 cm, seats 6', price: 14000, width: 183, depth: 107, height: 76, weight: 262, seats: 6 }
        ],
        variant: [
            { name: 'Table + chairs + china hutch', price: 0 },
            { name: 'Table + chairs only', price: -62000 }
        ]
    },
    'Two-Tone Dining Set with Cane-Back Chairs': {
        weight: 78,
        model: 'dining-rect',
        wood: {
            species: 'Mahogany table, rattan cane chair backs',
            construction: [
                'Turned legs with a dark espresso stain',
                'Hand-woven rattan cane chair backs',
                'Lighter honey-stained chair frames for contrast',
                'Satin polyurethane top that wipes clean'
            ]
        },
        size: [
            { name: '152 cm, seats 4', price: 0, width: 152, depth: 90, height: 76, weight: 78, seats: 4 },
            { name: '180 cm, seats 6', price: 10000, width: 180, depth: 95, height: 76, weight: 96, seats: 6 }
        ],
        variant: [
            { name: 'Table + chairs', price: 0 },
            { name: 'Table only', price: -22000, seats: 0 }
        ]
    },
    'Rustic Trestle Table with Wicker Chairs': {
        weight: 98,
        model: 'dining-rect',
        wood: {
            species: 'Reclaimed-look pine',
            construction: [
                'Chunky trestle-style legs with a lower stretcher',
                'Hand-distressed, weathered finish',
                'High-back woven wicker chairs on wooden frames',
                'Oil and wax top coat that is easy to refresh'
            ]
        },
        size: [
            { name: '180 cm, seats 6', price: 0, width: 180, depth: 95, height: 76, weight: 98, seats: 6 },
            { name: '220 cm, seats 8', price: 13000, width: 220, depth: 100, height: 76, weight: 120, seats: 8 }
        ],
        variant: [
            { name: 'Table + wicker chairs', price: 0 },
            { name: 'Table only', price: -26000, seats: 0 }
        ]
    },
    'Drop-Leaf Table with Ladder-Back Chairs': {
        weight: 38,
        model: 'dining-rect',
        wood: {
            species: 'Solid mahogany',
            construction: [
                'Two hinged drop leaves on swing-out supports',
                'Folds down to a 45 cm deep console against a wall',
                'Ladder-back chairs with hand-woven rush seats',
                'Satin polyurethane finish'
            ]
        },
        size: [
            { name: '90 × 90 cm open, seats 2', price: 0, width: 90, depth: 90, height: 76, weight: 34, seats: 2 },
            { name: '90 × 120 cm open, seats 4', price: 6000, width: 120, depth: 90, height: 76, weight: 42, seats: 4 }
        ],
        variant: [
            { name: 'Table + chairs', price: 0 },
            { name: 'Table only', price: -10000, seats: 0 }
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
    },
    { marker: 'seed:sofa-v1', category: 'sofa', products: SOFA_V1 },
    { marker: 'seed:sofa-details-v1', category: 'sofa', details: SOFA_DETAILS_V1 },
    { marker: 'seed:sofa-v2', category: 'sofa', products: SOFA_V2 },
    { marker: 'seed:sofa-details-v2', category: 'sofa', details: SOFA_DETAILS_V2 },
    { marker: 'seed:sofa-v3', category: 'sofa', products: SOFA_V3 },
    { marker: 'seed:sofa-details-v3', category: 'sofa', details: SOFA_DETAILS_V3 },
    { marker: 'seed:dining-room-set-v1', category: 'dining-room-sets', products: DINING_ROOM_SET_V1 },
    { marker: 'seed:dining-room-set-details-v1', category: 'dining-room-sets', details: DINING_ROOM_SET_DETAILS_V1 },
    { marker: 'seed:dining-room-set-v2', category: 'dining-room-sets', products: DINING_ROOM_SET_V2 },
    { marker: 'seed:dining-room-set-details-v2', category: 'dining-room-sets', details: DINING_ROOM_SET_DETAILS_V2 }
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
