import { db, isUuid, toOrder } from '../../../lib/db'
import { withUser } from '../../../lib/auth'

const STATUSES = ['Pending', 'In progress', 'In transit', 'Delivered']

export default withUser(async (req, res) => {
    const sql = await db()

    if (req.method === 'GET') {
        const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC`
        return res.status(200).json({ orders: rows.map(toOrder) })
    }

    if (req.method === 'PATCH') {
        const { orderId, status } = req.body || {}
        if (!isUuid(orderId) || !STATUSES.includes(status))
            return res.status(400).json({ error: 'Invalid order update' })
        const rows = await sql`UPDATE orders SET status = ${status} WHERE id = ${orderId} RETURNING *`
        if (!rows.length) return res.status(404).json({ error: 'Order not found' })
        return res.status(200).json({ order: toOrder(rows[0]) })
    }

    return res.status(405).end()
}, { admin: true })
