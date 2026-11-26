import { db, isUuid, toProduct } from '../../../lib/db'
import { withErrors } from '../../../lib/auth'

export default withErrors(async (req, res) => {
    if (req.method !== 'GET') return res.status(405).end()
    const { id } = req.query
    if (!isUuid(id)) return res.status(404).json({ error: 'Product not found' })
    const sql = await db()
    const rows = await sql`SELECT * FROM products WHERE id = ${id}`
    if (!rows.length) return res.status(404).json({ error: 'Product not found' })
    return res.status(200).json({ product: toProduct(rows[0]) })
})
