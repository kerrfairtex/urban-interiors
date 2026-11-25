// Product categories shown in Browse by Category, the mobile menu and the admin form.
// `slug` is the page URL and the `category` value stored on products, so keep it
// unchanged when renaming a title.
export const CATEGORIES = [
    { title: 'Sofa', slug: 'sofa' },
    { title: 'Bed', slug: 'bed' },
    { title: 'Nightstand', slug: 'nightstand' },
    { title: 'Dresser', slug: 'dresser' },
    { title: 'Wardrobe & Armoire', slug: 'ward-robe' },
    { title: 'Shoe rack', slug: 'shoe-rack' },
    { title: 'Shelf & Bookcase', slug: 'shelf' },
    { title: 'TV console', slug: 'tv-console' },
    { title: 'Table and chair', slug: 'table-and-chair' },
    { title: 'Buffet & Sideboard', slug: 'buffet-and-sideboard' },
    { title: 'Coffee Table', slug: 'coffee-table' },
    { title: 'Desk', slug: 'desk' },
    { title: 'Bench', slug: 'bench' },
    { title: 'Doors', slug: 'doors' }
]

export const categoryTitle = (slug) =>
    CATEGORIES.find(c => c.slug === slug)?.title || slug.replaceAll('-', ' ')
