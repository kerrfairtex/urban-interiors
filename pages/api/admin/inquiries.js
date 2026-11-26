import { db, isUuid, toInquiry } from '../../../lib/db'
import { withUser } from '../../../lib/auth'

const STATUSES = ['New', 'Replied', 'Closed']

export default withUser(async (req, res) => {
    const sql = await db()
    if (req.method === 'GET') {
        const rows = await sql`SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 200`
        return res.status(200).json({ inquiries: rows.map(toInquiry) })
    }
    if (req.method === 'PATCH') {
        const { id, status } = req.body || {}
        if (!isUuid(id) || !STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid update' })
        const rows = await sql`UPDATE inquiries SET status = ${status} WHERE id = ${id} RETURNING *`
        if (!rows.length) return res.status(404).json({ error: 'Inquiry not found' })
        return res.status(200).json({ inquiry: toInquiry(rows[0]) })
    }
    return res.status(405).end()
}, { admin: true })
