import { db, isUuid, toProduct } from '../../../lib/db'
import { withErrors } from '../../../lib/auth'

const PAGE_SIZE = 20

// GET /api/products?category=&subcategory=&color=&minPrice=&maxPrice=&offset=
// GET /api/products?ids=a,b,c
export default withErrors(async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end()
    const sql = await db()
    const q = req.query

    if (q.ids !== undefined) {
        const ids = String(q.ids).split(',').filter(isUuid)
        if (!ids.length) return res.status(200).json({ products: [] })
        const rows = await sql`SELECT * FROM products WHERE id = ANY(${ids}::uuid[])`
        return res.status(200).json({ products: rows.map(toProduct) })
    }

    const category = q.category ? String(q.category) : null
    const subcategory = q.subcategory ? String(q.subcategory) : null
    const color = q.color ? String(q.color) : null
    const minPrice = q.minPrice !== undefined && q.minPrice !== '' ? Number(q.minPrice) : null
    const maxPrice = q.maxPrice !== undefined && q.maxPrice !== '' ? Number(q.maxPrice) : null
    const offset = Math.max(0, Math.floor(Number(q.offset) || 0))
    const byPrice = minPrice !== null || maxPrice !== null

    const rows = await sql`
        SELECT * FROM products
        WHERE (${category}::text IS NULL OR category = ${category})
          AND (${subcategory}::text IS NULL OR ${subcategory} = ANY(subcategory))
          AND (${color}::text IS NULL OR ${color} = ANY(color))
          AND (${minPrice}::numeric IS NULL OR product_price >= ${minPrice})
          AND (${maxPrice}::numeric IS NULL OR product_price <= ${maxPrice})
        ORDER BY
          CASE WHEN ${byPrice}::boolean THEN product_price END ASC,
          created_at ASC, id ASC
        LIMIT ${PAGE_SIZE + 1} OFFSET ${offset}`

    const products = rows.slice(0, PAGE_SIZE).map(toProduct)
    return res.status(200).json({
        products,
        nextOffset: offset + products.length,
        endOfData: rows.length <= PAGE_SIZE
    })
})
