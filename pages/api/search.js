import { db, toProduct } from '../../lib/db'
import { withErrors } from '../../lib/auth'

// Matches every search word against product name, description and colours.
export default withErrors(async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end()
    const terms = String(req.query.q || '').toLowerCase().split(/\s+/)
        .map(t => t.replace(/[%_\\]/g, ''))
        .filter(t => t.length > 1)
        .slice(0, 8)
    if (!terms.length) return res.status(200).json({ products: [] })

    const patterns = terms.map(t => `%${t}%`)
    const sql = await db()
    const rows = await sql`
        SELECT * FROM products
        WHERE EXISTS (
            SELECT 1 FROM unnest(${patterns}::text[]) AS p(pattern)
            WHERE product_name ILIKE p.pattern
               OR description ILIKE p.pattern
               OR array_to_string(color, ' ') ILIKE p.pattern
        )
        ORDER BY created_at DESC
        LIMIT 20`
    return res.status(200).json({ products: rows.map(toProduct) })
})
